import { api } from "@/lib/api"
import { User, UserRole } from "@/lib/types"


export const adminService = {

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
    }
}