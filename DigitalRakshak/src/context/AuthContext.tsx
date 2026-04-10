import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type Role = "myself" | "elder" | "relative";

export interface User {
  role: Role;
  name: string;
  number: string;
  pin: string;
  relation?: string;
  elderName?: string;
  elderNumber?: string;
  elderPin?: string;
  rakhiMessage?: string;
  mediaLinks?: string[]; // up to 4 links
  relativeName?: string;
  relativeNumber?: string;
}

interface AuthContextType {
  user: User | null;
  login: (number: string, pin: string) => boolean;
  signup: (userData: User) => boolean;
  logout: () => void;
  getAllUsers: () => User[];
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("digirakshak_current_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const getAllUsers = (): User[] => {
    const usersStr = localStorage.getItem("digirakshak_users");
    return usersStr ? JSON.parse(usersStr) : [];
  };

  const login = (number: string, pin: string) => {
    const users = getAllUsers();
    // Normal or Relative login
    let foundUser = users.find(u => u.number === number && u.pin === pin);
    
    if (!foundUser) {
      // Check if it's an elder logging in through a relative's account creation
      const relativeAccount = users.find(u => u.role === "relative" && u.elderNumber === number && u.elderPin === pin);
      if (relativeAccount) {
        foundUser = {
          role: "elder",
          name: relativeAccount.elderName || "Elder",
          number: relativeAccount.elderNumber!,
          pin: relativeAccount.elderPin!,
          rakhiMessage: relativeAccount.rakhiMessage,
          mediaLinks: relativeAccount.mediaLinks,
          relativeName: relativeAccount.name,
          relativeNumber: relativeAccount.number,
          relation: relativeAccount.relation
        };
      }
    }

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("digirakshak_current_user", JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const signup = (userData: User) => {
    const users = getAllUsers();
    // basic check
    if (users.find(u => u.number === userData.number)) {
      alert("A user with this number already exists.");
      return false;
    }
    
    users.push(userData);
    localStorage.setItem("digirakshak_users", JSON.stringify(users));
    
    // Auto login
    let loginUser = userData;
    setUser(loginUser);
    localStorage.setItem("digirakshak_current_user", JSON.stringify(loginUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("digirakshak_current_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, getAllUsers }}>
      {children}
    </AuthContext.Provider>
  );
};
