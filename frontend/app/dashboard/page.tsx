"use client";
import { useUser } from "@/lib/context/user-context";
import { getDashboardPath } from "@/lib/utils/roles-util";
import { redirect } from "next/navigation";

const Dashboard = () => {
  const { user } = useUser();

  const dashboardPath = getDashboardPath(user?.role);
  return redirect(dashboardPath);
};

export default Dashboard;
