export interface Profile {
  name: string;
  profileType: "empresa" | "estudante";
  habilidades?: string[];
}

export interface User extends Profile {
  id: string;
  email: string;
}

export interface StoredUser extends User {
  passwordHash: string;
}