import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
         res.status(400).json({
          message: 'Email and password are required'
        });
      }

      const authData = await this.authService.login(email, password);
      
       res.status(200).json({
        message: 'Login successful',
        ...authData
      });
    } catch (error) {
       res.status(401).json({
        message: error instanceof Error ? error.message : 'Authentication failed'
      });
    }
  };
}