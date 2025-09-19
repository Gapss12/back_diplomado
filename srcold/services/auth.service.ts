import { User } from '../models/user.model';
import { generateAuthToken } from '../utils/session.utils';

export class AuthService {
  public async login(email: string, password: string) {
    const user = await User.findOne({ where: { email } });
    
    if (!user || !(await user.validPassword(password))) {
      throw new Error("Invalid email or password");
    }
     const token = generateAuthToken(user.id, user.email);
    return {token,user};
  }
}