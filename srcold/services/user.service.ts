import { User,UserAttributes } from '../models/user.model';


export class UserService {

  async createUser(dataUser: UserAttributes) {
    return await User.create(dataUser);
  }

  async getAllUsers() {
    return await User.findAll({
      attributes: { exclude: ['password'] }
    });
  }

  async getUserById(id: number) {
    return await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
  }

  async getUserByEmail(email: string) {
    return await User.findOne({
      where: { email }
    });
  }

  async updateUser(id: number, data: Partial<UserAttributes>) {
    const user = await User.findByPk(id);
    if (!user) throw new Error('User not found');
    return await user.update(data);
  }

  async deleteUser(id: number) {
    const user = await User.findByPk(id);
    if (!user) throw new Error('User not found');
    await user.destroy();
    return true;
  }
}