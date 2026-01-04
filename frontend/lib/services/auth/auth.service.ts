import { api } from "@/lib/api";
import {
  CurrentUserResponse,
  LoginInput,
  LoginResponse,
  RegisterInput,
  RegisterResponse,
  User,
  VerifyEmailResponse,
} from "@/lib/types";
import { get } from "http";

export const authService = {
  register: async (data: RegisterInput): Promise<RegisterResponse> => {
    return api.post<RegisterResponse>("/auth/register", data);
  },
  verifyEmail: async (token: string): Promise<VerifyEmailResponse> => {
    return api.get<VerifyEmailResponse>(`/auth/verify-email?token=${token}`);
  },
  resendVerificationEmail: async (email: string): Promise<VerifyEmailResponse> => {
    return api.post<VerifyEmailResponse>("/auth/resend-verification", { email });
  },
  login: async (data: LoginInput): Promise<LoginResponse> => {
    return api.post<LoginResponse>("/auth/login", data);
  },
  getCurrentUser: async (): Promise<CurrentUserResponse> => {
    return api.get<CurrentUserResponse>("/auth/me");

  }
};
  
