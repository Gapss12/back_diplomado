export interface JwtPayload {
    userId: string | number
    email: string
    [key: string]: any
  }
  
  export interface IJwtService {
    generateToken(payload: JwtPayload): string
    verifyToken(token: string): JwtPayload
  }