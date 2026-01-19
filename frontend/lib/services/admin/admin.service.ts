import { api } from "@/lib/api"
import { GetAllOrders, OrderPrams, PaymentPlatform, PaymentStatus, User, UserRole } from "@/lib/types"


export const adminService = {

    // users

    getAllUSers:async():Promise<{users:User[], total:number}> =>{
        return await api.get<{users:User[], total:number}>("/admin/users");
    },
    updateUserRole:async(userId:string,role:UserRole):Promise<{user:User}> =>{
        return await api.put<{user:User}>(`/admin/update-user/${userId}`,{role});
    },
    addUserCredits:async(userId:string,credits:number):Promise<{user:User}> =>{
        return await api.post<{user:User}>(`/admin/add-credits/${userId}`,{credits});
    },
    deleteUser:async(userId:string):Promise<void> =>{
        return await api.delete<void>(`/admin/delete-user/${userId}`);
    },
    banUser:async(userId:string,isBanned:boolean):Promise<{user:User,isBanned:boolean}> =>{
        return await api.put<{user:User,isBanned:boolean}>(`/admin/ban-user/${userId}`,{isBanned});
    },

    // orders
    getAllOrders:async(params?:OrderPrams):Promise<GetAllOrders> =>{
        return await api.get<GetAllOrders>(`/admin/orders?page=${params?.page || 1}&limit=${params?.limit || 10}&status=${params?.status ||''}`);
    }
}


interface orderData {
  _id: string;
  amount: number;
  credits: number;
  creditsAdded: boolean;
  platform: PaymentPlatform;
  status: PaymentStatus;
  package: {
    credits: number;
    name: string;
    price: number;
    _id: string;
  };
  user: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  pagination:{
    page: number;
    limit: number;
    total:number
    totalPages: number;
  }
}
