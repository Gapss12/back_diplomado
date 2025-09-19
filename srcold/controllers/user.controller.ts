import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { promises } from 'dns';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

 public createUser = async (req: Request, res: Response) => {
    try {
      const userData = {
        email: req.body.email,
        password: req.body.password
      };
      const user = await this.userService.createUser(userData);
      res.status(201).json({ 
        message: 'User created successfully',
        user
      });
    } catch (error) {
      res.status(400).json({ 
        message: error instanceof Error ? error.message : 'Error creating user'
      });
    }
};

  public getAllUsers = async (req: Request, res: Response) => {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  };

  public getUserById = async (req: Request, res: Response) =>  {
    try {
      const user = await this.userService.getUserById(parseInt(req.params.id));
      if (!user) res.status(404).json({ message: 'User not found' });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  };

  public updateUser = async (req: Request, res: Response) => {
    try {
      const user = await this.userService.updateUser(parseInt(req.params.id), req.body);
      res.status(200).json({ 
        message: 'User updated successfully',
        user: user
      });
    } catch (error) {
      res.status(400).json({ message: error });
    }
  };

  public deleteUser = async (req: Request, res: Response) => {
    try {
      await this.userService.deleteUser(parseInt(req.params.id));
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(400).json({ message: error });
    }
  };
}