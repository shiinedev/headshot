import { config } from "@/config";
import jwt, { type SignOptions } from "jsonwebtoken";
import type { StringValue } from "ms";


export interface TokenPayload {
  userId: string;
  email: string;
}

export class TokenService {
    //method to  generate JWT token
  generateSecretToken(payload: TokenPayload, secretType: "access" | "refresh") {
    const secret = this.getSecret(secretType);
    const expiresIn = this.getExpiresIn(secretType);
    console.log("expriesIn:", expiresIn);

    const options: SignOptions = {
      expiresIn: expiresIn as StringValue,
    };
    return jwt.sign(payload, secret, options);
  }

// generate token pairs

    generateTokenPair(payload: TokenPayload) {
        return{
            accessToken: this.generateSecretToken(payload, "access"),
            refreshToken: this.generateSecretToken(payload, "refresh"),
        }
    }



  //helper methods
  getSecret(secretType: "access" | "refresh") {
    return secretType === "access"
      ? config.jwt.secret
      : config.jwt.refreshSecret;
  }

  getExpiresIn(secretType: "access" | "refresh") {
    return secretType === "access"
      ? config.jwt.expiresIn
      : config.jwt.refreshExpiresIn;
  }
}

export const tokenService = new TokenService();
