import { User, type IUser} from "@/models"
import type { LoginInput, RegisterInput } from "@/validators"
import { passwordService } from "./password.service";
import { ConflictError, NotFoundError, ValidationErrors } from "@/utils/errors";
import { verificationService } from "./verification.service";
import { emailService } from "../notifications/email.service";
import { logger } from "@/utils/logger";



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

        try {
            await emailService.sendVerificationEmail(name, normalizedEmail, verificationToken);
        } catch (error) {
            logger.error("Failed to send verification email", { error, userId: user._id });
        }

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

    //verify user email
    async verifyUserEmail(token:string):Promise<void>{
        const user = await User.findOne({verificationToken:token});

        if(!user){
            throw new ValidationErrors("Validation Error",[{
                path: "token",
                message: "Invalid verification token",  
            }]);
        }


        //check if token is expired
        if(user.isEmailVerified){
            throw new ConflictError("Email is already verified")
        }

        if(user.verificationTokenExpiry && verificationService.isTokenExpired(user.verificationTokenExpiry)){
            throw new ValidationErrors("Validation Error",[{
                path: "token",
                message: "Verification token has expired",  
            }]);
        }
        
        user.isEmailVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiry = undefined;

        await user.save();
    }

    async loginUser(input:LoginInput):Promise<{user:IUser}>{

        const {email,password} = input;

        const normalizedEmail = this.normalizeEmail(email);

        const user = await User.findOne({email:normalizedEmail});

        //CHECK IF USER EXISTS
        if(!user){
            logger.warn("Login attempt with non-existing email", { email: normalizedEmail });
            throw new NotFoundError(`User with this email ${normalizedEmail} does not exist`);
        }

        //check if password matches
       const isPasswordMatch = await passwordService.comparePassword(password,user.password);
         if(!isPasswordMatch){
            logger.warn("Login attempt with incorrect password", { email: normalizedEmail });
            throw new ConflictError("Incorrect password");
         }

        //check if email is verified
        if(!user.isEmailVerified){
            logger.warn("Login attempt with unverified email", { email: normalizedEmail });
            throw new ConflictError("Email is not verified. Please verify your email to login.");
        }

        // ALL GOOD, RETURN USER

        return {user};
    }
}


export const authService  = new AuthService()