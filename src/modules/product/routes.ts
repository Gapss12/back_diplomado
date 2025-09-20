import { Router } from "express"
import multer from "multer"
import { productController } from "./controller"

const upload = multer({ 
  dest: 'uploads/temp',
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
})

const router = Router()

router.post("/", upload.single('image'), (req, res, next) => {
  console.log('Multer middleware executed')
  console.log('req.body after multer:', req.body)
  console.log('req.file after multer:', req.file)
  next()
}, productController.createProduct)

router.get("/", productController.getAllProducts)
router.get("/:id", productController.getProductById)
router.put("/:id", upload.single('image'), productController.updateProduct)
router.delete("/:id", productController.deleteProduct)

export const productRoutes = router
