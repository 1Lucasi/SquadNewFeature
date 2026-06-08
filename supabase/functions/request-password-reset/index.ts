import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const RESEND_FROM_EMAIL = Deno.env.get("RESEND_FROM_EMAIL") ?? "";

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const sha256Hex = async (value: string) => {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
};

const buildEmailHtml = (resetLink: string) => `
  <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.5;">
    <h2>Redefinir sua senha</h2>
    <p>Recebemos um pedido para redefinir sua senha.</p>
    <p>
      <a href="${resetLink}" style="display:inline-block;background:#111827;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;">
        Redefinir senha
      </a>
    </p>
    <p>Se o botao nao funcionar, copie e cole este link no navegador:</p>
    <p style="word-break: break-all;">${resetLink}</p>
    <p>Este link expira em 15 minutos.</p>
  </div>
`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return json(500, { error: "Supabase secrets are missing." });
  }

  if (!RESEND_API_KEY || !RESEND_FROM_EMAIL) {
    return json(500, { error: "Resend secrets are missing." });
  }

  try {
    const { email, appUrl } = await req.json();

    if (typeof email !== "string" || !email.trim()) {
      return json(400, { error: "Email is required." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const safeAppUrl = typeof appUrl === "string" && appUrl.startsWith("http") ? appUrl : "http://localhost:3000";

    const { data: usersData, error: usersError } = await admin.auth.admin.listUsers();
    if (usersError) return json(500, { error: "Unable to process request." });

    const user = usersData.users.find((u) => (u.email ?? "").toLowerCase() === cleanEmail);
    if (!user) {
      return json(200, { ok: true });
    }

    const rawToken = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");
    const tokenHash = await sha256Hex(rawToken);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    await admin
      .from("password_reset_tokens")
      .update({ used_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .is("used_at", null);

    const { error: insertError } = await admin.from("password_reset_tokens").insert({
      user_id: user.id,
      token_hash: tokenHash,
      expires_at: expiresAt,
    });

    if (insertError) {
      return json(500, { error: "Unable to process request." });
    }

    const resetLink = `${safeAppUrl.replace(/\/$/, "")}/reset-password?token=${encodeURIComponent(rawToken)}`;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: RESEND_FROM_EMAIL,
        to: [cleanEmail],
        subject: "Redefinicao de senha",
        html: buildEmailHtml(resetLink),
      }),
    });

    if (!emailResponse.ok) {
      await admin.from("password_reset_tokens").delete().eq("token_hash", tokenHash);
      return json(502, { error: "Unable to send email." });
    }

    return json(200, { ok: true });
  } catch {
    return json(500, { error: "Unexpected server error." });
  }
});
