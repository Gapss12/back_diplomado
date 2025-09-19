import { Request, Response, NextFunction } from 'express';
import { validateAuthToken } from '../utils/session.utils';


export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1];
    // verifica el token proporcionado
    if (token) {
        const authenticated = validateAuthToken(token);
        if (authenticated) {
            next();
        } else {
            res.status(401).send('Unauthorized');
        }
    }else{
        res.status(401).json({ error: 'Token no proporcionado' });
    }
} 