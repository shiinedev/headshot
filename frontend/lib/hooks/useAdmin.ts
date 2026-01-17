import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminService } from "../services/admin";
import { UserRole } from "@/lib/types";



export const UseGetAllUsers = () => {
  return useQuery({
    queryKey: ["all-users"],
    queryFn: async () => adminService.getAllUSers(),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const UseUpdateUserRole = () => {
    const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update-user-role"],
    mutationFn: async ({
      userId,
      newRole,
    }: {
      userId: string;
      newRole: UserRole;
    }) => adminService.updateUserRole(userId, newRole),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-users"] });
    },
  });
};

export const UseAddUserCredits = () => {
    const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["add-user-credits"],
    mutationFn: async ({
      userId,
      credits,
    }: {
      userId: string;
      credits: number;
    }) => adminService.addUserCredits(userId, credits),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-users"] });
    },
  });
};

export const UseDeleteUser = () => {
    const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-user"],
    mutationFn: async (userId: string) => adminService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-users"] });
    },
  });
};

export const UseBanUser = () => {
    const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["ban-user"],
    mutationFn: async ({ userId, isBanned }: { userId: string; isBanned: boolean }) => adminService.banUser(userId, isBanned),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-users"] });
    },
  });
};
