const express=require('express')
const router=express.Router()
const productController=require("../controllers/productController")
const { isAuthenticatedUser } = require('../middleware/auth')



router.post("/createProducts",isAuthenticatedUser,productController.createProduct)

router.put("/updateproduct/:id",isAuthenticatedUser,productController.updateProduct)

router.delete("/deleteproduct/:id",isAuthenticatedUser,productController.deleteProduct)

router.get("/getAllProducts",isAuthenticatedUser,productController.getAllProducts)
router.get('/getProductDetails/:id',productController.getProductDetails)




module.exports=router