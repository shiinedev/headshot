import { User, type IUser} from "@/models"
import type { RegisterInput } from "@/validators"
import { passwordService } from "./password.service";
import { ConflictError } from "@/utils/errors";
import { verificationService } from "./verification.service";



export class AuthService {
    async registerUser (input:RegisterInput):Promise<{user:IUser}> {
        // business logic will be here

        const {name,email,password} = input;

        console.log("Registering user with email:", input);

        //normalize email
        const normalizedEmail = this.normalizeEmail(email);

        //check if user already exists
       await this.checkUserExists(normalizedEmail);

       //hash password
        const hashedPassword = await passwordService.hashPassword(password); //await passwordService.hashPassword(password);

        //generate verification token
        const verificationToken = await verificationService.generateVerificationToken();
        const verificationTokenExpiry = verificationService.getTokenExpiryDate();

        //create User

        const user = await User.create({
            name,
            email:normalizedEmail,
            password:hashedPassword,
            verificationToken,
            verificationTokenExpiry,
            isEmailVerified:false
        })

        return {
          user
        }
    }


    private normalizeEmail(email:string):string{
        return email.trim().toLowerCase();
    }

    private async checkUserExists(email:string):Promise<void>{
       const existingUser = await User.findOne({email});
         if(existingUser){
            throw new ConflictError(`User with this email already exists : ${email}`);
         }
    }
}


export const authService  = new AuthService()