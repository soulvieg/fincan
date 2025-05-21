// src/contexts/UserContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5001";
axios.defaults.withCredentials = true;

const savedToken = localStorage.getItem("token");
if (savedToken) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
}

interface CreditCard {
  cardNumber: string;
  expirationDate: string;
  cardholderName: string;
}

export interface User {
  id?: number;
  first_name: string;
  last_name: string;
  name: string;
  surname: string;
  email: string;
  phone_number: string;
  address: string;
  creditCard?: CreditCard;
}

interface RegisterData {
  name: string;
  email: string;
  homeAddress: string;
  phone: number;
  password: string;
}

interface UserContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => void;
  deleteCreditCard: () => void;
  register: (data: RegisterData) => Promise<boolean>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  // on mount, if token exists fetch /me
  useEffect(() => {
    if (savedToken) {
      axios
        .get("/api/users/me")
        .then((res) => {
          const u = res.data.user;
          console.log(u);
          setUser({
            id: u.id,
            first_name: u.firstName || u.first_name,
            last_name: u.lastName || u.last_name,
            name: u.firstName || u.first_name,
            surname: u.lastName || u.last_name,
            email: u.email,
            phone_number: u.phoneNumber || u.phone || "",
            address: u.homeAddress || u.address || "",
            creditCard: u.creditCard || "",
          });
        })
        .catch(() => {
          localStorage.removeItem("token");
          delete axios.defaults.headers.common["Authorization"];
          setUser(null);
        });
    }
  }, []);

  // login: now backend returns fullUser with phoneNumber & creditCard
  const login = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const res = await axios.post("/api/users/login", { email, password });
      const { token, user: u } = res.data;
      if (!token) return false;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser({
        id: u.id,
        first_name: u.firstName || u.first_name,
        last_name: u.lastName || u.last_name,
        name: u.firstName || u.first_name,
        surname: u.lastName || u.last_name,
        email: u.email,
        phone_number: u.phoneNumber || u.phone || "",
        address: u.homeAddress || u.address || "",
        creditCard: u.creditCard,
      });
      return true;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      const parts = data.name.trim().split(" ");
      const firstName = parts[0];
      const lastName = parts.slice(1).join(" ") || "";

      const res = await axios.post("/api/users/signup", {
        firstName,
        lastName,
        email: data.email,
        homeAddress: data.homeAddress,
        phoneNumber: data.phone,
        password: data.password,
        userType: "customer",
      });
      return res.status === 201;
    } catch (err) {
      console.error("Registration error:", err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const updateUser = (updatedData: Partial<User>) => {
    setUser((u) => (u ? { ...u, ...updatedData } : u));
  };

  const deleteCreditCard = () => {
    setUser((u) => (u ? { ...u, creditCard: undefined } : u));
  };

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        updateUser,
        deleteCreditCard,
        register,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be within UserProvider");
  return ctx;
};