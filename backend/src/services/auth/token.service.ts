import { config } from "@/config";
import type { UserRole } from "@/models";
import { UnauthorizedError } from "@/utils/errors";
import jwt, { type SignOptions } from "jsonwebtoken";
import type { StringValue } from "ms";

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
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
    return {
      accessToken: this.generateSecretToken(payload, "access"),
      refreshToken: this.generateSecretToken(payload, "refresh"),
    };
  }

  //method to verify JWT token
  verifyAccessToken(
    token: string,
    secretType: "access" | "refresh" = "access"
  ): TokenPayload {
    const secret = this.getSecret(secretType);

    try {
      return jwt.verify(token, secret) as TokenPayload;
    } catch (error) {
      throw new UnauthorizedError("Invalid or expired token");
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
