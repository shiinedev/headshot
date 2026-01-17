"use client";
import { useMemo } from "react";
import { UsersTable } from "@/components/dashboard/users";
import type { UserRole } from "@/lib/types";
import { Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  UseAddUserCredits,
  UseBanUser,
  UseDeleteUser,
  UseGetAllUsers,
  UseUpdateUserRole,
} from "@/lib/hooks";
import { toast } from "sonner";

export default function UsersPage() {
  const { data } = UseGetAllUsers();
  const { mutate: updateRole, isPending: isUpdatingRole } = UseUpdateUserRole();
  const { mutate: deleteUser, isPending: isDeletingUser } = UseDeleteUser();
  const { mutate: addCredits, isPending: isAddingCredits } =
    UseAddUserCredits();
  const { mutate: banUser, isPending: isBanningUser } = UseBanUser();

  const users = useMemo(() => data?.users || [], [data]);

  const handleDeleteUser = (userId: string) => {
    deleteUser(userId, {
      onSuccess: () => {
        toast.success("User deleted successfully", {
          description: "The selected user has been deleted.",
        });
      },
      onError: (error) => {
        toast.error("Error deleting user", {
          description:
            error.message ||
            "An unexpected error occurred while deleting the user.",
        });
      },
    });
  };

  const handleBanUser = (userId: string, isBanned: boolean) => {
    banUser({ userId, isBanned }, {
      onSuccess: (data) => {
        console.log("ban user success data:", data.isBanned);
        toast.success(`${data.isBanned ? "Banned" : "Unbanned"} User successfully`, {
          description: `The selected user has been ${data.isBanned ? "banned" : "unbanned"}.`,
        });
      },
      onError: (error) => {
        toast.error("Error banning user", {
          description:
            error.message ||
            "An unexpected error occurred while banning the user.",
        });
      },
    });
  };

  const handleUpdateRole = (userId: string, newRole: UserRole) => {
    updateRole(
      { userId, newRole },
      {
        onSuccess: () => {
          toast.success("User role updated successfully", {
            description: `User role has been changed to ${newRole.toLocaleLowerCase()}.`,
          });
        },
        onError: (error) => {
          toast.error("Error updating user role", {
            description:
              error.message ||
              "An unexpected error occurred while updating the user role.",
          });
        },
      }
    );
  };

  const handleAddCredits = (userId: string, creditsToAdd: number) => {
    addCredits(
      { userId, credits: creditsToAdd },
      {
        onSuccess: () => {
          toast.success("Credits added successfully", {
            description: ` Added ${creditsToAdd} credits`,
          });
        },
        onError: (error) => {
          toast.error("Error adding credits", {
            description:
              error.message ||
              "An unexpected error occurred while adding credits.",
          });
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Users
            </h1>
          </div>
          <p className="text-muted-foreground">
            Manage and monitor all users in your system
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <UsersTable
              data={users}
              totalUsers={data?.total}
              onDeleteUser={handleDeleteUser}
              onUpdateRole={handleUpdateRole}
              onAddCredits={handleAddCredits}
              isUpdating={isUpdatingRole || isAddingCredits}
              isDeletingUser={isDeletingUser}
              onBanUser={handleBanUser}
              isBanningUser={isBanningUser}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
