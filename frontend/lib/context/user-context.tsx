"use client";
import { createContext, useContext } from "react";
import { User } from "@/lib/types";

interface userContextType {
  user: User | null;
}

interface userContextProviderProps {
  children: React.ReactNode;
  user: User | null;
}

const UserContext = createContext<userContextType | undefined>(undefined);

const UserContextProvider = ({ children, user }: userContextProviderProps) => {
  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};

export default UserContextProvider;


export const useUser = () =>{
    const context = useContext(UserContext);
    if(!context){
        throw new Error("useUser must be used within a UserContextProvider");   
    }
    return context;
}