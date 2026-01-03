import { useMutation } from "@tanstack/react-query"
import { LoginInput, RegisterInput } from "../types"
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


export const useResendVerificationEmail = () => {

    return useMutation({     
        mutationFn:(email:string) => authService.resendVerificationEmail(email),
        mutationKey:authKeys.all
    })
  
}   


export const useLogin = () => {

    return useMutation({
        mutationFn:(data:LoginInput) => authService.login(data),
        mutationKey:authKeys.all
    })
  
}
