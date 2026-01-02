import { api } from "@/lib/api"
import { RegisterInput, RegisterResponse } from "@/lib/types"



export const authService = {
    register:async (data:RegisterInput):Promise<RegisterResponse> => api.post<RegisterResponse>("/auth/register", data)
}