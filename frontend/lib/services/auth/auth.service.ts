import { api } from "@/lib/api";
import {
  RegisterInput,
  RegisterResponse,
  VerifyEmailResponse,
} from "@/lib/types";

export const authService = {
  register: async (data: RegisterInput): Promise<RegisterResponse> => {
    return api.post<RegisterResponse>("/auth/register", data);
  },
  verifyEmail: async (token: string): Promise<VerifyEmailResponse> => {
    return api.get<VerifyEmailResponse>(`/auth/verify-email?token=${token}`);
  },
  resendVerificationEmail: async (email: string): Promise<VerifyEmailResponse> => {
    return api.post<VerifyEmailResponse>("/auth/resend-verification", { email });
  }
};

