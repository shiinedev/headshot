import { useMutation, useQuery } from "@tanstack/react-query";
import { LoginInput, RegisterInput } from "@/lib/types";
import { authService } from "@/lib/services/auth";

const authKeys = {
  all: ["auth"] as const,
  currentUser: () => [...authKeys.all, "currentUser"] as const
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterInput) => authService.register(data),
  });
};

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: (token: string) => authService.verifyEmail(token),
  });
};

export const useResendVerificationEmail = () => {
  return useMutation({
    mutationFn: (email: string) => authService.resendVerificationEmail(email),
    mutationKey: authKeys.all,
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginInput) => authService.login(data),
  });
};

export const useCurrentUser = (options?: { redirectOnError?: boolean }) => {
  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: () => authService.getCurrentUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
    throwOnError: (error: any) => {
      if (options?.redirectOnError && typeof window !== "undefined" ) {
        window.location.href = "/login";
      }
      return false;
    },
  });
};


export const useLogout = () => {
  return useMutation({
    mutationFn: () => authService.logout(),
    mutationKey: authKeys.all,
  });
}