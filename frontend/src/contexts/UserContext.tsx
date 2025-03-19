import React, { createContext, useState, useContext, ReactNode } from "react";

interface User {
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
}

interface UserContextType {
  user: User;
  updateUser: (newUser: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  //change the function with info below to see profile and go to profile option
  /* const [user, setUser] = useState<User | null>({
    name: "John",
    surname: "Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    address: "123 Main Street, City, Country",
  });*/
  //change the function with   const [user, setUser] = useState<User | null>(null); to see please log in button
  const [user, setUser] = useState<User>({
    name: "John",
    surname: "Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    address: "123 Main Street, City, Country",
  });

  const updateUser = (newUser: Partial<User>) => {
    setUser((prevUser) => ({ ...prevUser, ...newUser }));
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
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
