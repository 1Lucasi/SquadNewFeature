import { StoredUser, User } from "../types/user";

const STORAGE_KEY = "squadfinder_users";

export const UserService = {
  getUsers: (): StoredUser[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveUsers: (users: StoredUser[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  },

  findByEmail: (email: string): StoredUser | undefined => {
    const users = UserService.getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  updateUserProfile: (userId: string, updates: Partial<User>): void => {
    const users = UserService.getUsers();
    const userIndex = users.findIndex((u) => u.id === userId);
    
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      UserService.saveUsers(users);
    }
  }
};