import { UserRole } from '@/lib/types';
import { getCurrentUser } from '@/lib/utils/auth-server'
import { redirect } from 'next/dist/client/components/navigation';
import React from 'react'

const AdminLayout = async ({children}: {children: React.ReactNode}) => {

    const user = await getCurrentUser();

    if(!user ){
        redirect("/login");
    }

    if(user.role !== UserRole.ADMIN){
        redirect("/dashboard/user");
    }
    
  return children
}

export default AdminLayout
