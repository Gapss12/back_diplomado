import jwt from 'jsonwebtoken';

export const generateAuthToken = (userId: number, email: string): string => {
  const payload = { userId, email };
  const secret = process.env.JWT_SECRET as string;
  const options: jwt.SignOptions = { 
    expiresIn: '5h' 
  };
  return jwt.sign(payload, secret, options);
};

export const validateAuthToken = (token: string): any => {
  const secret = process.env.JWT_SECRET as string;
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};