


export class AuthService {
    async registerUser (input:any):Promise<{success:boolean,message:string}> {
        // business logic will be here
        return {
            success:true,
            message:"User registered successfully"
        }
    }
}


export const authService  = new AuthService()