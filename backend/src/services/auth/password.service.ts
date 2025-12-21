import bcrypt from "bcrypt";

export class PasswordService{

    private readonly saltRound = 12;

    async hashPassword(password:string):Promise<string>{

        return await bcrypt.hash(password,this.saltRound)
    }

    async comparePassword(plainPassword:string,hashedPassword:string):Promise<boolean>{
        return await bcrypt.compare(plainPassword,hashedPassword);
    }

}


export const passwordService = new PasswordService();

