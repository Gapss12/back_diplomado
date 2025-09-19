import jwt from "jsonwebtoken";
import type { IJwtService, JwtPayload } from "../../core/auth/domain/IJwtService";

export class JwtService implements IJwtService {
  private readonly secretKey: string;

  constructor() {
    const secretKey = process.env.JWT_SECRET as string;
    if (!secretKey) {
      throw new Error("JWT_SECRET no está definido en las variables de entorno");
    }
    this.secretKey = secretKey;
  }
 
  generateToken(payload: JwtPayload): string {
    const options: jwt.SignOptions = { 
      expiresIn: '5h', 
    };
    return jwt.sign(payload, this.secretKey, options);
  }

  verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.secretKey) as JwtPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error("Token expirado");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error("Token inválido");
      }
      throw error;
    }
  }
}