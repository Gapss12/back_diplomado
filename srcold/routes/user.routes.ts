import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();
const userController = new UserController();

// Protected routes
router.post('/', userController.createUser);
router.get('/:id', userController.getUserById);
router.get('/',  userController.getAllUsers);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;