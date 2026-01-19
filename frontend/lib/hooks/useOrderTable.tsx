"use client";

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import type { PaymentStatus, PaymentPlatform, Order } from "@/lib/types";
import { OrdersTableProps } from "@/components/dashboard/orders-table";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  CreditCard,
  Wallet,
  LucideIcon,
  Wallet2,
} from "lucide-react";
import { format } from "date-fns";

const columns = (): ColumnDef<Order>[] => [
  {
    accessorKey: "_id",
    header: "Order ID",
    cell: ({ row }) => {
      const orderId = row.getValue("_id") as string;
      return (
        <span className="font-mono text-sm text-muted-foreground">
          {orderId}
        </span>
      );
    },
  },
  {
    accessorKey: "user",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-muted/50 -ml-4">
        Customer
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{user?.name}</span>
          <span className="text-sm text-muted-foreground">{user?.email}</span>
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      return rowA.original.user.name.localeCompare(rowB.original.user.name);
    },
  },
  {
    accessorKey: "package",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-muted/50 -ml-4">
        Package
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const pkg = row.original.package;
      return (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{pkg.name}</span>
          <span className="text-sm text-muted-foreground">
            {pkg.credits} credits
          </span>
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      return rowA.original.package.name.localeCompare(
        rowB.original.package.name,
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-muted/50 -ml-4">
        Amount
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = row.original.amount as number;
      return (
        <span className="font-semibold text-foreground">
          ${amount.toFixed(2)}
        </span>
      );
    },
  },
  {
    accessorKey: "platform",
    header: "Platform",
    cell: ({ row }) => {
      const platform = row.original.platform as string;
      const platformConfig:Record<PaymentPlatform,{icon:LucideIcon,label:string,className:string}> = {
        STRIPE: {
          icon: CreditCard,
          label: "Stripe",
          className: "bg-violet-100 text-violet-700 border-violet-200",
        },
        EVC: {
          icon: Wallet,
          label: "PayPal",
          className: "bg-blue-100 text-blue-700 border-blue-200",
        },
        ZAAD: {
          icon: Wallet2,
          label: "Razorpay",
          className: "bg-sky-100 text-sky-700 border-sky-200",
        },
        SAHAL: {
          icon: Wallet2,
          label: "Crypto",
          className: "bg-amber-100 text-amber-700 border-amber-200",
        },
        EBIR:{
            icon: Wallet,
            label: "Ebir",
            className: "bg-amber-100 text-amber-700 border-amber-200",
        },
        LOCAL:{
            icon: Wallet,
            label: "Local",
            className: "bg-amber-100 text-amber-700 border-amber-200",
        }
      };
      const config = platformConfig[platform as keyof typeof platformConfig];
      const Icon = config.icon as LucideIcon;
      return (
        <Badge
          variant="outline"
          className={`font-medium gap-1.5 ${config.className}`}>
          <Icon className="h-3.5 w-3.5" />
          {config.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-muted/50 -ml-4">
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.original.status as PaymentStatus;
      const statusConfig: Record<
        PaymentStatus,
        { icon: LucideIcon; label: string; className: string }
      > = {
        COMPLETED: {
          icon: CheckCircle2,
          label: "Completed",
          className: "bg-emerald-100 text-emerald-700 border-emerald-200",
        },
        PENDING: {
          icon: Clock,
          label: "Pending",
          className: "bg-amber-100 text-amber-700 border-amber-200",
        },
        FAILED: {
          icon: XCircle,
          label: "Failed",
          className: "bg-red-100 text-red-700 border-red-200",
        },
        REFUNDED: {
          icon: RotateCcw,
          label: "Refunded",
          className: "bg-slate-100 text-slate-700 border-slate-200",
        },
        PROCESSING: {
          icon: Clock,
          label: "Processing",
          className: "bg-amber-100 text-amber-700 border-amber-200",
        },
      };
      const config = statusConfig[status];
      console.log("status", status, config);
      const Icon = config.icon
      return (
        <Badge
          variant="outline"
          className={`font-medium gap-1.5 ${config.className}`}>
          <Icon className="h-3.5 w-3.5" />
          {config.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-muted/50 -ml-4">
        Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = row.original.createdAt as string;
      return (
        <div className="flex flex-col">
          <span className="text-foreground">
            {format(new Date(date), "MMM d, yyyy")}
          </span>
          <span className="text-sm text-muted-foreground">
            {format(new Date(date), "h:mm a")}
          </span>
        </div>
      );
    },
  },
];

export const useOrderTable = ({ data }: OrdersTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "all">(
    "all",
  );
  const [platformFilter, setPlatformFilter] = useState<PaymentPlatform | "all">(
    "all",
  );

  const filteredData = useMemo(() => {
    let result = data;

    if (statusFilter !== "all") {
      result = result.filter((order) => order.status === statusFilter);
    }

    if (platformFilter !== "all") {
      result = result.filter((order) => order.platform === platformFilter);
    }

    return result;
  }, [data, statusFilter, platformFilter]);

  const table = useReactTable({
    data: filteredData,
    columns: columns(),
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
  });

  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex;

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];

    if (pageCount <= 5) {
      for (let i = 0; i < pageCount; i++) {
        pages.push(i);
      }
    } else {
      pages.push(0);

      if (currentPage > 2) {
        pages.push("ellipsis");
      }

      const start = Math.max(1, currentPage - 1);
      const end = Math.min(pageCount - 2, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (currentPage < pageCount - 3) {
        pages.push("ellipsis");
      }

      if (!pages.includes(pageCount - 1)) {
        pages.push(pageCount - 1);
      }
    }

    return pages;
  };

  return {
    columns,
    table,
    sorting,
    setSorting,
    statusFilter,
    setStatusFilter,
    platformFilter,
    setPlatformFilter,
    globalFilter,
    setGlobalFilter,
    pageCount,
    currentPage,
    getPageNumbers,
  };
};
