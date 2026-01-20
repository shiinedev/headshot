"use client"

import {
  flexRender,
} from "@tanstack/react-table"
import { Order, PaymentStatus, PaymentPlatform } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Search, ShoppingCart } from "lucide-react"
import { useOrderTable } from "@/lib/hooks/useOrderTable"
import { useSearch } from "@/lib/hooks/useSearch"
import { useEffect, useMemo } from "react"


export interface OrdersTableProps {
  data: Order[]
}

export function OrdersTable({ data }: OrdersTableProps) {
 const {
    table,
    globalFilter,   
    setGlobalFilter,
    statusFilter,
    setStatusFilter,
    platformFilter,
    setPlatformFilter,
    columns,
    currentPage,
    getPageNumbers, 
 } = useOrderTable({ data });


 const [{limit,page,platform,status},setSearch] = useSearch();

 useEffect(() => {
  setSearch({limit,page})
 },[limit,page,setSearch]);


 const handleSetStatus = (status:PaymentStatus | "all") =>{

  setStatusFilter(status);
  setSearch({status});

 }

 const handleChangePlatform = (platform:PaymentPlatform | "all") =>{
  setPlatformFilter(platform);
  setSearch({platform});
 }


  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Select value={status} onValueChange={(value) => handleSetStatus(value as PaymentStatus | "all")}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value={PaymentStatus.COMPLETED}>Completed</SelectItem>
              <SelectItem value={PaymentStatus.PENDING}>Pending</SelectItem>
              <SelectItem value={PaymentStatus.FAILED}>Failed</SelectItem>
              <SelectItem value={PaymentStatus.REFUNDED}>Refunded</SelectItem>
              <SelectItem value={PaymentStatus.PROCESSING}>Processing</SelectItem>
            </SelectContent>
          </Select>
          <Select value={platform} onValueChange={(value) => handleChangePlatform(value as PaymentPlatform | "all")}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="STRIPE">Stripe</SelectItem>
              <SelectItem value="EVC">Evc</SelectItem>
              <SelectItem value="ZAAS">Zaad</SelectItem>
              <SelectItem value="ZAHAL">Zahal</SelectItem>
              <SelectItem value="LOCAL">Local</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShoppingCart className="h-4 w-4" />
            <span>
              {table.getFilteredRowModel().rows.length} order
              {table.getFilteredRowModel().rows.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/50 hover:bg-muted/50">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="font-semibold">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ShoppingCart className="h-8 w-8" />
                    <span>No orders found</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page</span>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
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

        <div className="flex-1 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => table.previousPage()}
                  className={!table.getCanPreviousPage() ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
                      className="cursor-pointer"
                    >
                      {page + 1}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => table.nextPage()}
                  className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  )
}
