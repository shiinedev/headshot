"use client";
import { flexRender } from "@tanstack/react-table";
import { User, UserRole } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Users, Coins, Loader } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useUsersTable } from "@/lib/hooks";
import DeleteDialog from "./delete-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Ban, UserCheck } from "lucide-react";


interface UsersTableProps {
  data: User[];
  totalUsers?: number;
  onDeleteUser: (userId: string) => void;
  onBanUser: (userId: string, isBanned: boolean) => void;
  onUpdateRole: (userId: string, newRole: UserRole) => void;
  onAddCredits: (userId: string, creditsToAdd: number) => void;
  isUpdating: boolean;
  isDeletingUser: boolean;
  isBanningUser: boolean;
}

export function UsersTable({
  data,
  onDeleteUser,
  onUpdateRole,
  onAddCredits,
  onBanUser,
  totalUsers,   
  isUpdating,
  isDeletingUser,
}: UsersTableProps) {
  const {
    table,
    confirmAddCredits,
    creditsAmount,
    setCreditsAmount,
    getPageNumbers,
    confirmDelete,
    creditsDialogOpen,
    deleteDialogOpen,
    setCreditsDialogOpen,
    userToDelete,
    userToUpdateCredits,
    globalFilter,
    setGlobalFilter,
    columns,
    setDeleteDialogOpen,
    currentPage,
    banDialogOpen,
    setBanDialogOpen,
    userToBan,
    confirmBan
  } = useUsersTable({
    data,
    onDeleteUser,
    onUpdateRole,
    onAddCredits,
    totalUsers,
    onBanUser,
  });

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-row gap-4 items-center ">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>
            {totalUsers} user
            {totalUsers !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-muted/50 hover:bg-muted/50">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="font-semibold">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Users className="h-8 w-8" />
                    <span>No users found</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows</span>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => table.setPageSize(Number(value))}>
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 30].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Pagination className="sm:justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => table.previousPage()}
                className={
                  !table.getCanPreviousPage()
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {getPageNumbers().map((page, index) => (
              <PaginationItem key={index}>
                {page === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    onClick={() => table.setPageIndex(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer">
                    {page + 1}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => table.nextPage()}
                className={
                  !table.getCanNextPage()
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        data={userToDelete?.name || ""}
        onDelete={confirmDelete}
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        isDeleting={isDeletingUser}
        type="user"
      />

      {/* Credits Update Dialog */}
      <Dialog open={creditsDialogOpen} onOpenChange={setCreditsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Credits</DialogTitle>
            <DialogDescription>
              Add credits for{" "}
              <span className="font-semibold">{userToUpdateCredits?.name}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border-2 border-border">
                <AvatarImage
                  src={userToUpdateCredits?.image}
                  alt={userToUpdateCredits?.name}
                />
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {userToUpdateCredits?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{userToUpdateCredits?.name}</p>
                <p className="text-sm text-muted-foreground">
                  Current credits: {userToUpdateCredits?.credits}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="credits">Credits to Add</Label>
              <Input
                id="credits"
                type="number"
                min="1"
                value={creditsAmount}
                onChange={(e) => setCreditsAmount(e.target.value)}
                placeholder="Enter amount to add"
              />
              {creditsAmount && Number.parseInt(creditsAmount, 10) > 0 && (
                <p className="text-sm text-muted-foreground">
                  New balance:{" "}
                  {(userToUpdateCredits?.credits || 0) +
                    Number.parseInt(creditsAmount, 10)}{" "}
                  credits
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreditsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmAddCredits}
              disabled={
                !creditsAmount || Number.parseInt(creditsAmount, 10) <= 0
              }>
              <Coins className="mr-2 h-4 w-4" />
              {isUpdating ?<span> <Loader className="h-4 w-4 mr-2"/> Adding..</span>: "Add Credits"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

       {/* Ban Confirmation Dialog */}
      <AlertDialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{userToBan?.isActive ? "Ban User" : "Unban User"}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {userToBan?.isActive ? "ban" : "unban"}{" "}
              <span className="font-semibold">{userToBan?.name}</span>?
              {userToBan?.isActive
                ? " They will no longer be able to access the platform."
                : " They will regain access to the platform."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBan}
              className={
                userToBan?.isActive
                  ? "bg-orange-500 hover:bg-orange-600 text-white"
                  : "bg-emerald-500 hover:bg-emerald-600 text-white"
              }
            >
              {userToBan?.isActive ? (
                <>
                  <Ban className="mr-2 h-4 w-4" />
                  Ban User
                </>
              ) : (
                <>
                  <UserCheck className="mr-2 h-4 w-4" />
                  Unban User
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
