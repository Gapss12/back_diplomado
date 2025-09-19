import type { Request, Response, NextFunction } from "express"
import { JwtService } from "../services/JwtService"

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string | number
        email: string
      }
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Acceso no autorizado. Token no proporcionado",
      })
      return
    }

    const token = authHeader.split(" ")[1]
    const jwtService = new JwtService()

    const decoded = jwtService.verifyToken(token)
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    }

    next()
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Acceso no autorizado. Token inválido",
    })
  }
}
22