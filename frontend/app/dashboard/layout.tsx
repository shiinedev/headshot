import DashboardLayoutComponent from "@/components/dashboard/dashboard-layout";
import UserContextProvider from "@/lib/context/user-context";
import { getCurrentUser } from "@/lib/utils/auth-server";
import { redirect } from "next/navigation";

const DashboardRootLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <UserContextProvider user={user}>
      <DashboardLayoutComponent >
        {children}
      </DashboardLayoutComponent>
    </UserContextProvider>
  );
};

export default DashboardRootLayout;
