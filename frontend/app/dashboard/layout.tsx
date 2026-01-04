import UserContextProvider from "@/lib/context/user-context";
import { getCurrentUser } from "@/lib/utils/auth-server"
import { redirect } from "next/navigation";


const DashboardLayout = async({children}: {children: React.ReactNode}) => {

    const user = await getCurrentUser();

    if(!user){
       redirect("/login");
    }

  return (
    <UserContextProvider user={user}>
        {children}
    </UserContextProvider>
  )
}

export default DashboardLayout
