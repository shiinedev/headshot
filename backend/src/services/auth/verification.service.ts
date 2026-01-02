import crypto from "crypto";

class VerificationService {
    private readonly tokenLength = 32;
    private readonly tokenExpiryHours = 24;


    generateVerificationToken(){
        return crypto.randomBytes(this.tokenLength).toString('hex');
    }

    getTokenExpiryDate():Date{
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + this.tokenExpiryHours);
        return expiryDate;
    }

    isExpired(expiryDate:Date):boolean{
        return new Date() > expiryDate;
    }
}

export const verificationService = new VerificationService();
