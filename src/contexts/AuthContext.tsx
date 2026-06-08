import { createContext, useContext, useEffect, useState, useRef, ReactNode } from "react";
import { User, StoredUser } from "../types/user";
import { hashPassword, generateId } from "../utils/crypto";
import { UserService } from "../services/UserService";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, name: string, profileType: "empresa" | "estudante") => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateSession: (user: User) => void; // Nova função para o ProfileEditor usar
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({}),
  signUp: async () => ({}),
  signOut: async () => {},
  updateSession: () => {},
});

export const useAuth = () => useContext(AuthContext);

const SESSION_KEY = "squadfinder_session";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const sessionData = localStorage.getItem(SESSION_KEY);
    if (sessionData) {
      setUser(JSON.parse(sessionData));
    }
    setLoading(false);
  }, []);

  const updateSession = (updatedUser: User) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    const user = UserService.findByEmail(email);
    
    if (!user) return { error: "Usuário não encontrado" };
    if (user.passwordHash !== hashPassword(password)) return { error: "Senha incorreta" };

    const sessionUser: User = {
      id: user.id, email: user.email, name: user.name, 
      profileType: user.profileType, habilidades: user.habilidades || [],
    };

    updateSession(sessionUser);
    return {};
  };

  const signUp = async (email: string, password: string, name: string, profileType: "empresa" | "estudante"): Promise<{ error?: string }> => {
    if (UserService.findByEmail(email)) {
      return { error: "Este e-mail já está cadastrado" };
    }

    const newUser: StoredUser = {
      id: generateId(), email: email.toLowerCase(), passwordHash: hashPassword(password),
      name, profileType, habilidades: []
    };

    const users = UserService.getUsers();
    UserService.saveUsers([...users, newUser]);

    const sessionUser: User = {
      id: newUser.id, email: newUser.email, name: newUser.name, 
      profileType: newUser.profileType, habilidades: []
    };

    updateSession(sessionUser);
    return {};
  };

  const signOut = async () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateSession }}>
      {children}
    </AuthContext.Provider>
  );
};