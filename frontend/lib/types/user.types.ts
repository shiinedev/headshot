export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  credits: number;
  isEmailVerified?: boolean;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}
