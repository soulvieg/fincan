import React, { createContext, useState, useContext } from "react";

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

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User>({
    name: "John",
    surname: "Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    address: "123 Street, City",
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
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
