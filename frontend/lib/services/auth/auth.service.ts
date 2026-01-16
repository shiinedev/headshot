import { api } from "@/lib/api";
import {
  CurrentUserResponse,
  LoginInput,
  LoginResponse,
  RegisterInput,
  RegisterResponse,
  GeneralResponse,
} from "@/lib/types";



export const authService = {
  register: async (data: RegisterInput): Promise<RegisterResponse> => {
    return api.post<RegisterResponse>("/auth/register", data);
  },
  verifyEmail: async (token: string): Promise<GeneralResponse> => {
    return api.get<GeneralResponse>(`/auth/verify-email?token=${token}`);
  },
  resendVerificationEmail: async (email: string): Promise<GeneralResponse> => {
    return api.post<GeneralResponse>("/auth/resend-verification", { email });
  },
  login: async (data: LoginInput): Promise<LoginResponse> => {
    return api.post<LoginResponse>("/auth/login", data);
  },
  getCurrentUser: async (): Promise<CurrentUserResponse> => {
    return api.get<CurrentUserResponse>("/auth/me");

  },
  logout: async (): Promise<GeneralResponse> => {
    return api.post<GeneralResponse>("/auth/logout");
  }
};
  
