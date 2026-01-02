import { useMutation } from "@tanstack/react-query"
import { RegisterInput } from "../types"
import { authService } from "../services/auth"

const authKeys = {
    all: ["auth"] as const,
}

export const useRegister = () => {

    return useMutation({
        mutationFn:(data:RegisterInput) => authService.register(data),
        mutationKey:authKeys.all
    })
  
}


export const useVerifyEmail = () => {

    return useMutation({
        mutationFn:(token:string) => authService.verifyEmail(token),
        mutationKey:authKeys.all
    })
  
}