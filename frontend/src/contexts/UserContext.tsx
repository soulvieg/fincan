import React, { createContext, useState, useContext, ReactNode } from "react";
import axios from "axios";

interface CreditCard {
  cardNumber: string;
  expirationDate: string;
  cardholderName: string;
}

interface User {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
  creditCard?: CreditCard;
}

// Interface for registration data
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
  const [user, setUser] = useState<User | null>({
    id: 1,
    first_name: "John",
    last_name: "Doe",
    email: "johndoe@example.com",
    phone_number: "+1234567890",
    address: "123 Main St, Springfield",
    creditCard: undefined,
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Make API call to login endpoint
      const response = await axios.post("/api/auth/login", { email, password });

      if (response.data && response.data.user) {
        // Transform the user data to match our User interface
        const userData: User = {
          id: response.data.user.id,
          first_name:
            response.data.user.firstName || response.data.user.first_name,
          last_name:
            response.data.user.lastName || response.data.user.last_name,
          email: response.data.user.email,
          phone_number:
            response.data.user.phone || response.data.user.phone_number || "",
          address:
            response.data.user.address || response.data.user.homeAddress || "",
          creditCard: undefined, // We typically don't get credit card info on login
        };

        setUser(userData);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      // Split the name into first and last name
      const nameParts = data.name.split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

      // Make API call to register endpoint
      const response = await axios.post("/api/auth/register", {
        firstName,
        lastName,
        email: data.email,
        password: data.password,
        phone: data.phone,
        address: data.homeAddress,
      });

      if (response.data && response.data.success) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (updatedData: Partial<User>) => {
    if (user) {
      setUser((prevUser) => ({
        ...prevUser!,
        ...updatedData,
      }));
    }
  };

  const deleteCreditCard = () => {
    if (user) {
      setUser((prevUser) => ({
        ...prevUser!,
        creditCard: undefined,
      }));
    }
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
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
