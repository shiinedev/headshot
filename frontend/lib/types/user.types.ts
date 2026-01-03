export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",  
}

export interface User {
  id: string;
  name: string;
  email: string;
  credits: number;
  role: UserRole;
  image?: string;
  isActive: boolean;
  isEmailVerified?: boolean;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}
