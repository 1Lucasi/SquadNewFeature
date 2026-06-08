import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return json(500, { error: "Supabase secrets are missing." });
  }

  try {
    const { token, password } = await req.json();

    if (typeof token !== "string" || token.length < 20) {
      return json(400, { error: "Invalid token." });
    }

    if (typeof password !== "string" || password.length < 6) {
      return json(400, { error: "Password must have at least 6 characters." });
    }

    const tokenHash = await sha256Hex(token);
    const nowIso = new Date().toISOString();

    const { data, error } = await admin
      .from("password_reset_tokens")
      .select("id, user_id, expires_at, used_at")
      .eq("token_hash", tokenHash)
      .maybeSingle();

    if (error || !data) {
      return json(400, { error: "Invalid or expired link." });
    }

    if (data.used_at || new Date(data.expires_at).getTime() < Date.now()) {
      return json(400, { error: "Invalid or expired link." });
    }

    const { error: updateError } = await admin.auth.admin.updateUserById(data.user_id, {
      password,
    });
    if (updateError) {
      return json(500, { error: "Unable to update password." });
    }

    await admin.from("password_reset_tokens").update({ used_at: nowIso }).eq("id", data.id);

    return json(200, { ok: true });
  } catch {
    return json(500, { error: "Unexpected server error." });
  }
});
