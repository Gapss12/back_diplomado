import { Router } from "express"
import { userController } from "./controller"

const router = Router()

// Rutas públicas
router.post("/", userController.createUser)
router.get("/", userController.getAllUsers)
router.get("/:id", userController.getUserById)
router.put("/:id", userController.updateUser)
router.delete("/:id", userController.deleteUser)

export const userRoutes = router
