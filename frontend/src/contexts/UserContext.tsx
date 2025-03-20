import React, { createContext, useState, useContext, ReactNode } from "react";

interface User {
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
}

interface UserContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => void; // Added updateUser
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  /*replace the function below to see profile settings and dropdown in main page
  const [user, setUser] = useState<User | null>({
  name: "John",
  surname: "Doe",
  email: "johndoe@example.com",
  phone: "+1234567890",
  address: "123 Main St, Springfield",
});
*/
  //replace the function below with   const [user, setUser] = useState<User | null>(null); to see log in button
  const [user, setUser] = useState<User | null>({
    name: "John",
    surname: "Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
    address: "123 Main St, Springfield",
  });

  const login = (userData: User) => {
    setUser(userData);
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

  return (
    <UserContext.Provider value={{ user, login, logout, updateUser }}>
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
