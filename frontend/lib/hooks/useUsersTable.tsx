"use client"

import { useState, useMemo } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table"
import { User, UserRole } from "@/lib/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


import {
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  Mail,
  MailX,
  MoreHorizontal,
  Trash2,
  Shield,
  UserCog,
  UserIcon,
  Coins,
  Ban,
  UserCheck,
} from "lucide-react"
import { format, set } from "date-fns"


interface UsersTableProps {
  data: User[],
  totalUsers?: number,
  onDeleteUser: (userId: string) => void
  onBanUser: (userId: string,isBanned:boolean) => void
  onUpdateRole: (userId: string, newRole: UserRole) => void
  onAddCredits: (userId: string, creditsToAdd: number) => void
}

interface userIdName{
  id: string;
  name: string;
}

export function useUsersTable({ data, onDeleteUser, onBanUser, onUpdateRole, onAddCredits,totalUsers }: UsersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<userIdName | null>(null)
  const [creditsDialogOpen, setCreditsDialogOpen] = useState(false)
  const [userToUpdateCredits, setUserToUpdateCredits] = useState<userIdName & {image?: string,credits:number} | null>(null)
  const [creditsAmount, setCreditsAmount] = useState("")
   const [userToBan, setUserToBan] = useState<userIdName & {isActive: boolean} | null>(null)
    const [banDialogOpen, setBanDialogOpen] = useState(false)

  const handleDeleteClick = (user: userIdName) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (userToDelete && onDeleteUser) {
      onDeleteUser(userToDelete.id)
    }
    setDeleteDialogOpen(false)
    setUserToDelete(null)
  }

  const handleCreditsClick = (user: userIdName & {image?: string,credits:number}) => {
    setUserToUpdateCredits(user)
    setCreditsAmount("")
    setCreditsDialogOpen(true)
  }

  const confirmAddCredits = () => {
    if (userToUpdateCredits && onAddCredits) {
      const creditsToAdd = Number.parseInt(creditsAmount, 10)
      if (!isNaN(creditsToAdd) && creditsToAdd > 0) {
        onAddCredits(userToUpdateCredits.id, creditsToAdd)
      }
    }
    setCreditsDialogOpen(false)
    setUserToUpdateCredits(null)
    setCreditsAmount("")
  }

   const handleBanClick = (user: userIdName & {isActive: boolean}) => {
    setUserToBan(user)
    setBanDialogOpen(true)
  }

  const confirmBan = () => {
    if (userToBan && onBanUser) {
      onBanUser(userToBan.id,!userToBan.isActive)
    }
    setBanDialogOpen(false)
    setUserToBan(null)
  }

  const columns: ColumnDef<User>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-muted/50 -ml-4"
          >
            User
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const user = row.original
          return (
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-border">
                <AvatarImage src={user.image} alt={user.name} />
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium text-foreground">{user.name}</span>
                <span className="text-sm text-muted-foreground">{user.email}</span>
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: "role",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-muted/50 -ml-4"
          >
            Role
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const role = row.getValue("role") as string
          const roleStyles = {
            ADMIN: "bg-red-100 text-red-700 border-red-200",
            USER: "bg-sky-100 text-sky-700 border-sky-200",
          }
          return (
            <Badge
              variant="outline"
              className={`capitalize font-medium ${roleStyles[role as keyof typeof roleStyles]}`}
            >
              {role}
            </Badge>
          )
        },
      },
      {
        accessorKey: "credits",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-muted/50 -ml-4"
          >
            Credits
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const credits = row.getValue("credits") as number
          return (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">{credits}</span>
            </div>
          )
        },
      },
      {
        accessorKey: "isActive",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-muted/50 -ml-4"
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const isActive = row.getValue("isActive") as boolean
          return (
            <div className="flex items-center gap-2">
              {isActive ? (
                <div className="flex items-center gap-1.5 text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="font-medium">Active</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <XCircle className="h-4 w-4" />
                  <span className="font-medium">Inactive</span>
                </div>
              )}
            </div>
          )
        },
      },
      {
        accessorKey: "isEmailVerified",
        header: "Email",
        cell: ({ row }) => {
          const isVerified = row.getValue("isEmailVerified") as boolean
          return (
            <div className="flex items-center gap-1.5">
              {isVerified ? (
                <div className="flex items-center gap-1.5 text-emerald-600">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">Verified</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-amber-600">
                  <MailX className="h-4 w-4" />
                  <span className="text-sm">Pending</span>
                </div>
              )}
            </div>
          )
        },
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-muted/50 -ml-4"
          >
            Joined
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const date = row.getValue("createdAt") as Date
          return <span className="text-muted-foreground">{format(date, "MMM d, yyyy")}</span>
        },
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => {
          const user = row.original
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <UserCog className="mr-2 h-4 w-4" />
                    Change Role
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => onUpdateRole?.(user._id, UserRole.ADMIN)} disabled={user.role === UserRole.ADMIN}>
                      <Shield className="mr-2 h-4 w-4 text-red-500" />
                      Admin
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onUpdateRole?.(user._id, UserRole.USER)} disabled={user.role === UserRole.USER}>
                      <UserIcon className="mr-2 h-4 w-4 text-sky-500" />
                      User
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuItem onClick={() => handleCreditsClick({id: user._id,name:user.name,image:user.image ,credits:user.credits})}>
                  <Coins className="mr-2 h-4 w-4 text-amber-500" />
                  Add Credits
                </DropdownMenuItem>
                 <DropdownMenuItem onClick={() => handleBanClick({id: user._id,name:user.name,isActive:user.isActive})}>
              {user.isActive ? (
                <>
                  <Ban className="mr-2 h-4 w-4 text-orange-500" />
                  Ban User
                </>
              ) : (
                <>
                  <UserCheck className="mr-2 h-4 w-4 text-emerald-500" />
                  Unban User
                </>
              )}
            </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleDeleteClick({
                    id: user._id,
                    name: user.name,
                  })}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete User
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    [onUpdateRole, totalUsers],
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  })

   const pageCount = useMemo(() => table.getPageCount(), [table])
  const currentPage = useMemo(() => table.getState().pagination.pageIndex, [table])

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = []

    if (pageCount <= 5) {
      for (let i = 0; i < pageCount; i++) {
        pages.push(i)
      }
    } else {
      pages.push(0)

      if (currentPage > 2) {
        pages.push("ellipsis")
      }

      const start = Math.max(1, currentPage - 1)
      const end = Math.min(pageCount - 2, currentPage + 1)

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i)
        }
      }

      if (currentPage < pageCount - 3) {
        pages.push("ellipsis")
      }

      if (!pages.includes(pageCount - 1)) {
        pages.push(pageCount - 1)
      }
    }
    return pages
  }

  return {
    table,
    getPageNumbers,
    deleteDialogOpen,
    setDeleteDialogOpen,
    userToDelete,
    userToUpdateCredits,
    creditsDialogOpen,
    setCreditsDialogOpen,
    creditsAmount,
    setCreditsAmount,
    confirmAddCredits,
    confirmDelete,
    globalFilter,
    setGlobalFilter,
    columns,
    currentPage,
    userToBan,
    banDialogOpen,
    setBanDialogOpen,
    confirmBan,

  }
}
