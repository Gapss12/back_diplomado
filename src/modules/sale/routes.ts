import { Router } from "express"
import { saleController } from "./controller"
import { authMiddleware } from "../../infrastructure/middlewares/authMiddleware"

const router = Router()

router.use(authMiddleware)

router.post("/", saleController.createSale)
router.get("/", saleController.getAllSales)
router.get("/:id", saleController.getSaleById)

export const saleRoutes = router
