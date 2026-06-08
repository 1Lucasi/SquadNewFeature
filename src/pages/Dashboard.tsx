import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Building2, GraduationCap, LogOut, Loader2 } from "lucide-react";
import ProfileEditor from "@/components/ProfileEditor";
import PortfolioEditor from "@/components/PortfolioEditor";
import RecommendedUsers from "@/components/RecommendedUsers";

interface Profile {
  name: string;
  profileType: "empresa" | "estudante";
  habilidades?: string[];
}

const Dashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name,
        profileType: user.profileType,
        habilidades: user.habilidades || [],
      });
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !profile) return null;

  const isEmpresa = profile.profileType === "empresa";

  const handleProfileUpdate = (updated: Profile) => {
    setProfile(updated);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
            Painel
          </h1>
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-2xl space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent shrink-0">
            {isEmpresa ? (
              <Building2 className="h-7 w-7 text-accent-foreground" />
            ) : (
              <GraduationCap className="h-7 w-7 text-accent-foreground" />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
              Bem-vindo, {profile.name}!
            </h2>
            <p className="text-sm text-muted-foreground capitalize">
              {profile.profileType} · {user.email}
            </p>
          </div>
        </div>

        <ProfileEditor userId={user.id} profile={profile} onSave={handleProfileUpdate} />

        <RecommendedUsers />

        {/* Portfólio só aparece para estudantes */}
        {!isEmpresa && <PortfolioEditor userId={user.id} />}
      </main>
    </div>
  );
};

export default Dashboard;
