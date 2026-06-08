import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, ArrowLeft, KeyRound, MailCheck } from "lucide-react";

const STORAGE_KEY = "squadfinder_users";
const RESET_TOKENS_KEY = "squadfinder_reset_tokens";

interface StoredUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  profileType: "empresa" | "estudante";
  habilidades?: string[];
}

interface ResetToken {
  email: string;
  token: string;
  expiresAt: number;
}

const hashPassword = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
};

const generateToken = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

type Step = "email" | "code" | "newPassword" | "success";

const ForgotPassword = () => {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Step 1 — verificar e-mail e gerar token
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!email.trim()) errs.email = "E-mail é obrigatório";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "E-mail inválido";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 600)); // simula latência

    const users: StoredUser[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const userExists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!userExists) {
      // Não revelar se o e-mail existe ou não (boa prática de segurança)
      // Mas como é um projeto acadêmico/local, avisamos diretamente
      setErrors({ email: "Nenhuma conta encontrada com este e-mail" });
      setLoading(false);
      return;
    }

    const token = generateToken();
    const resetTokens: ResetToken[] = JSON.parse(localStorage.getItem(RESET_TOKENS_KEY) || "[]")
      .filter((t: ResetToken) => t.email !== email.toLowerCase()); // remove token antigo do mesmo e-mail

    resetTokens.push({
      email: email.toLowerCase(),
      token,
      expiresAt: Date.now() + 15 * 60 * 1000, // expira em 15 minutos
    });

    localStorage.setItem(RESET_TOKENS_KEY, JSON.stringify(resetTokens));

    // Em produção real, o token seria enviado por e-mail.
    // Aqui exibimos via toast pois é um sistema local.
    toast.success(`Código de recuperação: ${token}`, {
      description: "Em produção, este código seria enviado por e-mail. Válido por 15 minutos.",
      duration: 30000,
    });

    setLoading(false);
    setStep("code");
  };

  // Step 2 — validar código
  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!code.trim()) errs.code = "Código é obrigatório";
    else if (code.length !== 6 || !/^\d+$/.test(code)) errs.code = "Código deve ter 6 dígitos";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));

    const resetTokens: ResetToken[] = JSON.parse(localStorage.getItem(RESET_TOKENS_KEY) || "[]");
    const tokenEntry = resetTokens.find(
      (t) => t.email === email.toLowerCase() && t.token === code
    );

    if (!tokenEntry) {
      setErrors({ code: "Código inválido" });
      setLoading(false);
      return;
    }

    if (Date.now() > tokenEntry.expiresAt) {
      setErrors({ code: "Código expirado. Solicite um novo." });
      setLoading(false);
      return;
    }

    setLoading(false);
    setStep("newPassword");
  };

  // Step 3 — definir nova senha
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!newPassword) errs.newPassword = "Senha é obrigatória";
    else if (newPassword.length < 6) errs.newPassword = "Senha deve ter pelo menos 6 caracteres";
    if (!confirmPassword) errs.confirmPassword = "Confirmação é obrigatória";
    else if (newPassword !== confirmPassword) errs.confirmPassword = "As senhas não coincidem";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));

    const users: StoredUser[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const userIndex = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());

    if (userIndex === -1) {
      toast.error("Usuário não encontrado. Tente novamente.");
      setLoading(false);
      return;
    }

    users[userIndex].passwordHash = hashPassword(newPassword);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));

    // Remove o token usado
    const resetTokens: ResetToken[] = JSON.parse(localStorage.getItem(RESET_TOKENS_KEY) || "[]")
      .filter((t: ResetToken) => t.email !== email.toLowerCase());
    localStorage.setItem(RESET_TOKENS_KEY, JSON.stringify(resetTokens));

    setLoading(false);
    setStep("success");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md border-border shadow-xl">

        {/* Step 1 — E-mail */}
        {step === "email" && (
          <>
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-3xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                Esqueci a senha
              </CardTitle>
              <CardDescription>
                Informe seu e-mail e enviaremos um código de recuperação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={errors.email ? "border-destructive" : ""}
                    autoFocus
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Enviar código
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  <Link to="/login" className="inline-flex items-center gap-1 text-primary font-medium hover:underline">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Voltar para o login
                  </Link>
                </p>
              </form>
            </CardContent>
          </>
        )}

        {/* Step 2 — Código */}
        {step === "code" && (
          <>
            <CardHeader className="text-center space-y-2">
              <div className="flex justify-center mb-1">
                <MailCheck className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                Digite o código
              </CardTitle>
              <CardDescription>
                O código de 6 dígitos foi exibido na notificação acima (em produção, chegaria por e-mail para <strong>{email}</strong>)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCodeSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="code">Código de recuperação</Label>
                  <Input
                    id="code"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="000000"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    className={`text-center text-2xl tracking-widest font-mono ${errors.code ? "border-destructive" : ""}`}
                    autoFocus
                  />
                  {errors.code && <p className="text-sm text-destructive">{errors.code}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Verificar código
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Não recebeu?{" "}
                  <button
                    type="button"
                    className="text-primary font-medium hover:underline"
                    onClick={() => {
                      setStep("email");
                      setCode("");
                      setErrors({});
                    }}
                  >
                    Reenviar
                  </button>
                </p>
              </form>
            </CardContent>
          </>
        )}

        {/* Step 3 — Nova senha */}
        {step === "newPassword" && (
          <>
            <CardHeader className="text-center space-y-2">
              <div className="flex justify-center mb-1">
                <KeyRound className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                Nova senha
              </CardTitle>
              <CardDescription>
                Escolha uma nova senha para sua conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="newPassword">Nova senha</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={errors.newPassword ? "border-destructive" : ""}
                    autoFocus
                  />
                  {errors.newPassword && <p className="text-sm text-destructive">{errors.newPassword}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Repita a senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={errors.confirmPassword ? "border-destructive" : ""}
                  />
                  {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Redefinir senha
                </Button>
              </form>
            </CardContent>
          </>
        )}

        {/* Step 4 — Sucesso */}
        {step === "success" && (
          <>
            <CardHeader className="text-center space-y-2">
              <div className="flex justify-center mb-1">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                Senha redefinida!
              </CardTitle>
              <CardDescription>
                Sua senha foi alterada com sucesso. Faça login com a nova senha.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/login">
                <Button className="w-full">Ir para o login</Button>
              </Link>
            </CardContent>
          </>
        )}

      </Card>
    </div>
  );
};

export default ForgotPassword;
