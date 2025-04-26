// src/contexts/UserContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import axios from "axios";

// Configure Axios base URL and credentials
axios.defaults.baseURL = "http://localhost:5001";
axios.defaults.withCredentials = true;

// Load token from localStorage if present
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
  name: string;    // alias for first_name
  surname: string; // alias for last_name
  email: string;
  phone_number: string;
  address: string;
  creditCard?: CreditCard;
}

interface RegisterData {
  name: string;
  email: string;
  homeAddress: string;
  phone: string;
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

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // On mount, if token exists, fetch current user
  useEffect(() => {
    if (savedToken) {
      axios
        .get("/api/users/me")
        .then((res) => {
          const u = res.data;
          const userData: User = {
            id: u.id,
            first_name: u.firstName || u.first_name,
            last_name: u.lastName || u.last_name,
            name: u.firstName || u.first_name,
            surname: u.lastName || u.last_name,
            email: u.email,
            phone_number: u.phone || u.phone_number || "",
            address: u.address || u.homeAddress || "",
            creditCard: undefined,
          };
          setUser(userData);
        })
        .catch(() => {
          // Token invalid or expired
          localStorage.removeItem("token");
          delete axios.defaults.headers.common["Authorization"];
          setUser(null);
        });
    }
  }, []);

  // Login and capture JWT
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post("/api/users/login", { email, password });
      const { token, user: u } = response.data;
      if (!token || !u) return false;
      // Save token
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      // Map user
      const userData: User = {
        id: u.id,
        first_name: u.firstName || u.first_name,
        last_name: u.lastName || u.last_name,
        name: u.firstName || u.first_name,
        surname: u.lastName || u.last_name,
        email: u.email,
        phone_number: u.phone || u.phone_number || "",
        address: u.address || u.homeAddress || "",
        creditCard: undefined,
      };
      setUser(userData);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  // Register new user
  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      const parts = data.name.trim().split(" ");
      const firstName = parts[0];
      const lastName = parts.slice(1).join(" ") || "";
      const response = await axios.post(
        "/api/users/signup",
        {
          firstName,
          lastName,
          email: data.email,
          homeAddress: data.homeAddress,
          phone: data.phone,
          password: data.password,
          userType: "customer",
        }
      );
      return response.status === 201;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

  // Logout user and clear token
  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  // Update local user state
  const updateUser = (updatedData: Partial<User>) => {
    if (user) setUser((prev) => ({ ...prev!, ...updatedData }));
  };

  // Remove credit card from local state
  const deleteCreditCard = () => {
    if (user) setUser((prev) => ({ ...prev!, creditCard: undefined }));
  };

  return (
    <UserContext.Provider
      value={{ user, login, logout, updateUser, deleteCreditCard, register }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
