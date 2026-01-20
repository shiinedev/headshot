"use client";

import { useMemo } from "react";
import { OrdersTable } from "@/components/dashboard/orders-table";
import { OrdersTableSkeleton } from "@/components/dashboard/orders-skeleton";
import { Card, CardContent } from "@/components/ui/card";

import { UseGetAllOrders } from "@/lib/hooks";
import { useSearch } from "@/lib/hooks/useSearch";

export default function OrdersPage() {
  const [{ limit, page, platform, status }] = useSearch();

  const {data,isLoading} = UseGetAllOrders({
      limit,
      page,
      platform,
      status,
    });
  

  const orders = useMemo(() => data?.orders || [], [data]);
  console.log("orders", orders);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all payment orders
          </p>
        </div>

        {/* Orders Table */}
        <Card>
          <CardContent className="p-6">
            {isLoading ? (
              <OrdersTableSkeleton />
            ) : (
              <OrdersTable data={orders} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
