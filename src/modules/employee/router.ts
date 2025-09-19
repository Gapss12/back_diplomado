import { Router } from "express"
import { employeeController } from "./controller"

const router = Router()


router.post("/", employeeController.createEmployeeWithUser)
router.get("/", employeeController.getAllEmployees)
router.get("/:id", employeeController.getEmployeeById)
router.put("/:id", employeeController.updateEmployee)
router.delete("/:id", employeeController.deleteEmployee)

export const employeeRoutes = router
