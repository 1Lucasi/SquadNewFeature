import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Rocket, Menu, X, Zap, Building2, GraduationCap, ArrowRight, ChevronDown,
  Target, Users, Layers, Award, Briefcase, DollarSign, UserPlus, Search,
  Handshake, Github, Twitter, Linkedin, Mail, Sparkles
} from "lucide-react";

// ─── Utilities ────────────────────────────────────────────────────────────────

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("lp-visible");
          obs.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNav = (id: string) => {
    scrollTo(id);
    setMenuOpen(false);
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(255,255,255,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : undefined,
        boxShadow: scrolled ? "0 1px 0 hsl(220,13%,91%)" : undefined,
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <button
          onClick={() => handleNav("hero")}
          className="flex items-center gap-2 text-lg font-bold transition-colors"
          style={{ fontFamily: "'DM Serif Display', serif", color: "var(--lp-foreground)" }}
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-lg text-white" style={{ background: "var(--lp-primary)" }}>
            <Rocket className="w-4 h-4" />
          </span>
          Squad Finder
        </button>

        <div className="hidden md:flex items-center gap-8">
          {[{ label: "O que é?", id: "about" }, { label: "Benefícios", id: "benefits" }, { label: "Como funciona", id: "how" }].map(({ label, id }) => (
            <button
              key={id}
              onClick={() => handleNav(id)}
              className="text-sm font-medium transition-colors hover:opacity-100"
              style={{ color: "var(--lp-muted)" }}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="text-sm font-medium px-3 py-2 transition-colors"
            style={{ color: "var(--lp-muted)" }}
          >
            Entrar
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="text-sm font-semibold px-4 py-2 rounded-lg text-white transition-colors"
            style={{ background: "var(--lp-primary)" }}
          >
            Cadastrar-se
          </button>
        </div>

        <button
          className="md:hidden p-2 rounded-lg transition-colors"
          style={{ color: "var(--lp-muted)" }}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden px-4 py-4 space-y-3 border-b" style={{ background: "rgba(255,255,255,0.96)", backdropFilter: "blur(12px)", borderColor: "var(--lp-border)" }}>
          {[{ label: "O que é?", id: "about" }, { label: "Benefícios", id: "benefits" }, { label: "Como funciona", id: "how" }].map(({ label, id }) => (
            <button
              key={id}
              onClick={() => handleNav(id)}
              className="block w-full text-left text-sm font-medium py-2 transition-colors"
              style={{ color: "var(--lp-muted)" }}
            >
              {label}
            </button>
          ))}
          <div className="flex gap-3 pt-2 border-t" style={{ borderColor: "var(--lp-border)" }}>
            <button onClick={() => navigate("/login")} className="flex-1 text-sm font-medium border px-4 py-2 rounded-lg transition-colors" style={{ borderColor: "var(--lp-border)" }}>
              Entrar
            </button>
            <button onClick={() => navigate("/signup")} className="flex-1 text-sm font-semibold text-white px-4 py-2 rounded-lg" style={{ background: "var(--lp-primary)" }}>
              Cadastrar-se
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection() {
  const navigate = useNavigate();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-16 overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 80% 10%, hsl(168,80%,90%) 0%, transparent 50%),
          radial-gradient(ellipse at 10% 90%, hsl(168,60%,88%) 0%, transparent 45%),
          hsl(210,20%,98%)
        `,
      }}
    >
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full opacity-60" style={{ background: "radial-gradient(circle, hsl(168,70%,85%) 0%, transparent 70%)" }} />
        <div className="absolute -bottom-40 -left-32 w-[450px] h-[450px] rounded-full opacity-50" style={{ background: "radial-gradient(circle, hsl(168,60%,88%) 0%, transparent 70%)" }} />
        <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="lp-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(168,80%,36%)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#lp-grid)" />
        </svg>
      </div>

      {/* Floating badges */}
      <div className="pointer-events-none absolute hidden lg:block top-32 left-16 lp-float">
        <div className="bg-white/80 backdrop-blur-sm border rounded-xl px-3 py-2 shadow-lg text-xs font-medium flex items-center gap-2" style={{ borderColor: "var(--lp-border)", color: "var(--lp-muted)" }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--lp-primary)" }} />
          3 squads formados hoje
        </div>
      </div>
      <div className="pointer-events-none absolute hidden lg:block bottom-40 right-16 lp-float-delay">
        <div className="bg-white/80 backdrop-blur-sm border rounded-xl px-3 py-2 shadow-lg text-xs font-medium flex items-center gap-2" style={{ borderColor: "var(--lp-border)", color: "var(--lp-muted)" }}>
          <GraduationCap className="w-3 h-3" style={{ color: "var(--lp-primary)" }} />
          1.200+ estudantes cadastrados
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-3xl text-center space-y-7">
        <div className="inline-flex lp-fade-up">
          <span className="lp-badge-pill">
            <Zap className="w-3.5 h-3.5" style={{ color: "var(--lp-primary)" }} />
            Matchmaking inteligente de talentos
          </span>
        </div>

        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight lp-fade-up-1"
          style={{ fontFamily: "'DM Serif Display', serif", color: "var(--lp-foreground)" }}
        >
          Conectamos{" "}
          <em className="not-italic" style={{ color: "var(--lp-primary)" }}>talentos</em>{" "}
          a empresas que fazem a{" "}
          <span className="relative inline-block">
            diferença
            <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 12" preserveAspectRatio="none" style={{ height: "8px" }}>
              <path d="M0,8 Q75,0 150,6 Q225,12 300,4" fill="none" stroke="hsl(168,80%,60%)" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </span>
        </h1>

        <p className="mx-auto max-w-xl text-base sm:text-lg leading-relaxed lp-fade-up-2" style={{ color: "var(--lp-muted)" }}>
          O Squad Finder forma as equipes ideais para cada projeto usando algoritmos inteligentes.
          Encontre seu squad perfeito em minutos — sem fricção, sem ruído.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1 lp-fade-up-3">
          <button
            onClick={() => navigate("/signup")}
            className="group w-full sm:w-auto flex items-center justify-center gap-2 text-white px-6 py-3.5 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5"
            style={{ background: "var(--lp-primary)" }}
          >
            <Building2 className="w-4 h-4" />
            Sou Empresa
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-white border px-6 py-3.5 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5"
            style={{ borderColor: "var(--lp-border)", color: "var(--lp-foreground)" }}
          >
            <GraduationCap className="w-4 h-4" />
            Sou Estudante
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <p className="text-xs lp-fade-up-4" style={{ color: "var(--lp-muted)" }}>
          Gratuito para estudantes · Sem compromisso para empresas
        </p>
      </div>

      <button
        onClick={() => scrollTo("stats")}
        className="absolute bottom-8 animate-bounce transition-colors"
        style={{ color: "var(--lp-muted)" }}
        aria-label="Rolar para baixo"
      >
        <ChevronDown className="w-6 h-6" />
      </button>
    </section>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const steps = 50;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current = Math.min(current + increment, target);
            setCount(Math.floor(current));
            if (current >= target) clearInterval(timer);
          }, 1600 / steps);
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString("pt-BR")}{suffix}</span>;
}

function StatsSection() {
  const stats = [
    { value: 1200, suffix: "+", label: "Estudantes cadastrados" },
    { value: 85, suffix: "+", label: "Empresas parceiras" },
    { value: 320, suffix: "+", label: "Squads formados" },
    { value: 98, suffix: "%", label: "Taxa de satisfação" },
  ];

  return (
    <section id="stats" className="py-16 md:py-20" style={{ background: "var(--lp-primary)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-white text-center">
          {stats.map(({ value, suffix, label }) => (
            <div key={label} className="space-y-1">
              <div className="text-4xl md:text-5xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>
                <Counter target={value} suffix={suffix} />
              </div>
              <div className="text-sm opacity-80 font-medium">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────

function AboutSection() {
  const ref = useReveal();
  const pillars = [
    { icon: Target, label: "Match Inteligente", desc: "Algoritmos que combinam perfis técnicos e comportamentais com precisão cirúrgica." },
    { icon: Users, label: "Squads sob Medida", desc: "Equipes multidisciplinares montadas especificamente para cada projeto e empresa." },
    { icon: Layers, label: "Gestão Simplificada", desc: "Dashboard unificado para acompanhar squads, candidatos e progresso em tempo real." },
  ];

  return (
    <section id="about" className="py-24 md:py-32" style={{ background: "var(--lp-card)" }}>
      <div ref={ref} className="lp-reveal max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="lp-badge-pill mb-5 inline-flex">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--lp-primary)" }} />
            Sobre a plataforma
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5" style={{ fontFamily: "'DM Serif Display', serif", color: "var(--lp-foreground)" }}>
            O que é o{" "}<span style={{ color: "var(--lp-primary)" }}>Squad Finder</span>?
          </h2>
          <p className="text-base sm:text-lg leading-relaxed" style={{ color: "var(--lp-muted)" }}>
            Uma plataforma inteligente que conecta talentos acadêmicos a empresas, formando as equipes
            ideais para cada tipo de projeto. Através de algoritmos avançados de matchmaking,
            analisamos habilidades, experiências e objetivos para criar combinações perfeitas.
          </p>
          <p className="text-sm mt-3 leading-relaxed" style={{ color: "var(--lp-muted)" }}>
            Empresas encontram os profissionais certos, e estudantes ganham oportunidades reais de
            crescimento — tudo de forma rápida, transparente e eficiente.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {pillars.map(({ icon: Icon, label, desc }, i) => (
            <div
              key={label}
              className="lp-card-hover flex flex-col items-center text-center p-7 rounded-2xl border bg-white"
              style={{ borderColor: "var(--lp-border)", transitionDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center justify-center rounded-xl mb-5" style={{ width: 52, height: 52, background: "var(--lp-primary-faint)" }}>
                <Icon className="w-5 h-5" style={{ color: "var(--lp-primary)" }} />
              </div>
              <h3 className="text-base font-semibold mb-2" style={{ fontFamily: "'DM Serif Display', serif", color: "var(--lp-foreground)" }}>{label}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--lp-muted)" }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Benefits ─────────────────────────────────────────────────────────────────

function BenefitCard({ icon: Icon, title, desc, delay }: { icon: React.ElementType; title: string; desc: string; delay: number }) {
  return (
    <div className="lp-card-hover flex flex-col p-6 rounded-2xl border bg-white" style={{ borderColor: "var(--lp-border)", transitionDelay: `${delay}ms` }}>
      <div className="flex items-center justify-center w-11 h-11 rounded-xl mb-4" style={{ background: "var(--lp-primary-faint)" }}>
        <Icon className="w-5 h-5" style={{ color: "var(--lp-primary)" }} />
      </div>
      <h3 className="text-base font-semibold mb-2" style={{ fontFamily: "'DM Serif Display', serif", color: "var(--lp-foreground)" }}>{title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: "var(--lp-muted)" }}>{desc}</p>
    </div>
  );
}

function BenefitsSection() {
  const ref1 = useReveal();
  const ref2 = useReveal();
  const studentBenefits = [
    { icon: Award, title: "Crie seu Portfólio", desc: "Construa um portfólio profissional com projetos reais que impressionam recrutadores e abrem portas." },
    { icon: Briefcase, title: "Trabalhe em Projetos Reais", desc: "Participe de desafios reais de empresas e aplique o que aprendeu na prática desde cedo." },
    { icon: Users, title: "Ganhe Experiência em Equipe", desc: "Desenvolva habilidades colaborativas trabalhando em squads multidisciplinares e diversos." },
  ];
  const companyBenefits = [
    { icon: Zap, title: "Formação Automática de Squads", desc: "Nossos algoritmos montam a equipe ideal com base nas necessidades específicas do seu projeto." },
    { icon: Target, title: "Talentos Qualificados sob Medida", desc: "Acesse estudantes com habilidades específicas, filtrados e ranqueados para cada vaga." },
    { icon: DollarSign, title: "Gestão de Custos Otimizada", desc: "Reduza custos de recrutamento e onboarding com squads prontos para entregar resultados." },
  ];

  return (
    <section id="benefits" className="py-24 md:py-32" style={{ background: "var(--lp-background)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-20">
        <div ref={ref1} className="lp-reveal">
          <div className="text-center mb-10">
            <span className="lp-badge-pill mb-4 inline-flex">
              <GraduationCap className="w-3.5 h-3.5" style={{ color: "var(--lp-primary)" }} />
              Para Estudantes
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: "'DM Serif Display', serif", color: "var(--lp-foreground)" }}>Impulsione sua carreira</h2>
            <p className="mt-3 text-sm max-w-md mx-auto" style={{ color: "var(--lp-muted)" }}>Saia da teoria e entre no mercado com projetos reais no currículo.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {studentBenefits.map((b, i) => <BenefitCard key={b.title} {...b} delay={i * 100} />)}
          </div>
        </div>

        <div className="flex items-center gap-4 max-w-2xl mx-auto">
          <div className="flex-1 h-px" style={{ background: "var(--lp-border)" }} />
          <span className="w-8 h-8 flex items-center justify-center rounded-full border" style={{ borderColor: "var(--lp-border)", color: "var(--lp-primary)", background: "white" }}>✦</span>
          <div className="flex-1 h-px" style={{ background: "var(--lp-border)" }} />
        </div>

        <div ref={ref2} className="lp-reveal">
          <div className="text-center mb-10">
            <span className="lp-badge-pill mb-4 inline-flex">
              <Building2 className="w-3.5 h-3.5" style={{ color: "var(--lp-primary)" }} />
              Para Empresas
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: "'DM Serif Display', serif", color: "var(--lp-foreground)" }}>Monte equipes de alto impacto</h2>
            <p className="mt-3 text-sm max-w-md mx-auto" style={{ color: "var(--lp-muted)" }}>Deixe o algoritmo trabalhar por você. Foque no produto, não no recrutamento.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {companyBenefits.map((b, i) => <BenefitCard key={b.title} {...b} delay={i * 100} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────

function HowItWorksSection() {
  const ref = useReveal();
  const steps = [
    { icon: UserPlus, step: "01", title: "Crie seu perfil", desc: "Cadastre-se como empresa ou estudante e preencha suas habilidades, objetivos e preferências." },
    { icon: Search, step: "02", title: "O algoritmo trabalha", desc: "Nossa IA analisa todos os perfis e encontra os melhores matches para o seu projeto ou perfil." },
    { icon: Handshake, step: "03", title: "Conheça seu squad", desc: "Receba sugestões de equipe ou de empresas parceiras — filtre, avalie e aceite as conexões." },
    { icon: Rocket, step: "04", title: "Comece a construir", desc: "Com o squad formado, é hora de colocar a mão na massa e transformar ideias em realidade." },
  ];

  return (
    <section id="how" className="py-24 md:py-32 relative overflow-hidden" style={{ background: "var(--lp-card)" }}>
      <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 rounded-full opacity-30" style={{ background: "radial-gradient(circle, hsl(168,60%,88%) 0%, transparent 70%)" }} />
      <div ref={ref} className="lp-reveal max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="lp-badge-pill mb-5 inline-flex">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--lp-primary)" }} />
            Processo simples
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold" style={{ fontFamily: "'DM Serif Display', serif", color: "var(--lp-foreground)" }}>
            Como funciona?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px" style={{ background: "var(--lp-border)", zIndex: 0 }} />
          {steps.map(({ icon: Icon, step, title, desc }, i) => (
            <div key={step} className="relative z-10 flex flex-col items-center text-center group" style={{ transitionDelay: `${i * 100}ms` }}>
              <div className="flex items-center justify-center w-20 h-20 rounded-2xl mb-5 border-2 bg-white shadow-sm transition-all relative" style={{ borderColor: "var(--lp-border)" }}>
                <Icon className="w-8 h-8" style={{ color: "var(--lp-primary)" }} />
                <span className="absolute -top-2.5 -right-2.5 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: "var(--lp-primary)", fontFamily: "'JetBrains Mono', monospace" }}>
                  {i + 1}
                </span>
              </div>
              <h3 className="text-base font-semibold mb-2" style={{ fontFamily: "'DM Serif Display', serif", color: "var(--lp-foreground)" }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--lp-muted)" }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────

function CTASection() {
  const navigate = useNavigate();
  const ref = useReveal();

  return (
    <section className="py-24 md:py-32 relative overflow-hidden" style={{ background: "var(--lp-background)" }}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(168,80%,60%), transparent)" }} />
      <div ref={ref} className="lp-reveal max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-20 blur-3xl" style={{ background: "radial-gradient(circle, hsl(168,80%,60%) 0%, transparent 70%)" }} />
        <div className="relative z-10 space-y-6">
          <span className="lp-badge-pill mb-2 inline-flex">
            <Sparkles className="w-3.5 h-3.5" style={{ color: "var(--lp-primary)" }} />
            Comece gratuitamente
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold" style={{ fontFamily: "'DM Serif Display', serif", color: "var(--lp-foreground)" }}>
            Pronto para encontrar seu squad?
          </h2>
          <p className="text-base sm:text-lg max-w-xl mx-auto leading-relaxed" style={{ color: "var(--lp-muted)" }}>
            Cadastre-se gratuitamente e comece a conectar talentos a oportunidades reais. Sem burocracia, sem compromisso.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate("/signup")}
              className="group w-full sm:w-auto flex items-center justify-center gap-2 text-white px-7 py-3.5 rounded-xl font-semibold transition-all hover:-translate-y-0.5"
              style={{ background: "var(--lp-primary)" }}
            >
              Começar agora
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => scrollTo("about")}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-transparent border px-7 py-3.5 rounded-xl font-semibold transition-colors"
              style={{ borderColor: "var(--lp-border)", color: "var(--lp-foreground)" }}
            >
              Saiba mais
            </button>
          </div>
          <p className="text-xs" style={{ color: "var(--lp-muted)" }}>
            ✓ Grátis para estudantes &nbsp;·&nbsp; ✓ Sem cartão de crédito &nbsp;·&nbsp; ✓ Cancele quando quiser
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="border-t py-12" style={{ borderColor: "var(--lp-border)", background: "var(--lp-card)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 mb-10">
          <div className="sm:col-span-2 space-y-4">
            <div className="flex items-center gap-2 font-bold" style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.125rem", color: "var(--lp-foreground)" }}>
              <span className="flex items-center justify-center w-7 h-7 rounded-lg text-white" style={{ background: "var(--lp-primary)" }}>
                <Rocket className="w-3.5 h-3.5" />
              </span>
              Squad Finder
            </div>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: "var(--lp-muted)" }}>
              Conectando talentos acadêmicos a empresas que transformam ideias em realidade. Matchmaking inteligente, squads de alto impacto.
            </p>
            <div className="flex gap-2.5">
              {[{ Icon: Github, label: "GitHub" }, { Icon: Twitter, label: "Twitter" }, { Icon: Linkedin, label: "LinkedIn" }, { Icon: Mail, label: "Email" }].map(({ Icon, label }) => (
                <a key={label} href="#" aria-label={label} className="flex items-center justify-center w-9 h-9 rounded-lg border transition-colors" style={{ borderColor: "var(--lp-border)", color: "var(--lp-muted)" }}>
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold" style={{ color: "var(--lp-foreground)" }}>Plataforma</h4>
            <ul className="space-y-2 text-sm" style={{ color: "var(--lp-muted)" }}>
              {[{ label: "O que é?", id: "about" }, { label: "Benefícios", id: "benefits" }, { label: "Como funciona", id: "how" }].map(({ label, id }) => (
                <li key={id}><button onClick={() => scrollTo(id)} className="hover:opacity-100 transition-opacity">{label}</button></li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold" style={{ color: "var(--lp-foreground)" }}>Conta</h4>
            <ul className="space-y-2 text-sm" style={{ color: "var(--lp-muted)" }}>
              <li><button onClick={() => navigate("/login")} className="transition-opacity">Login</button></li>
              <li><button onClick={() => navigate("/signup")} className="transition-opacity">Cadastro</button></li>
              <li><button onClick={() => navigate("/forgot-password")} className="transition-opacity">Recuperar senha</button></li>
              <li><a href="#" className="transition-opacity">Suporte</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style={{ borderColor: "var(--lp-border)", color: "var(--lp-muted)" }}>
          <span>© {new Date().getFullYear()} Squad Finder. Todos os direitos reservados.</span>
          <div className="flex gap-4">
            <a href="#" className="transition-opacity">Privacidade</a>
            <a href="#" className="transition-opacity">Termos de uso</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

const LandingPage = () => {
  return (
    <div className="lp-root">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <BenefitsSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;
