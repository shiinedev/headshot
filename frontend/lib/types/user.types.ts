export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",  
}

export interface User {
  _id: string;
  name: string;
  email: string;
  credits: number;
  role: UserRole;
  image?: string;
  isActive: boolean;
  isEmailVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
