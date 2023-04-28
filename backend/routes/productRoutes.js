const express=require('express')
const router=express.Router()
const productController=require("../controllers/productController")
const { isAuthenticatedUser , autharizedRoles} = require('../middleware/auth')



router.post("/createProducts",isAuthenticatedUser,autharizedRoles("admin"),productController.createProduct)

router.put("/updateproduct/:id",isAuthenticatedUser,autharizedRoles("admin"),productController.updateProduct)

router.delete("/deleteproduct/:id",isAuthenticatedUser,autharizedRoles("admin"),productController.deleteProduct)


router.get("/getAllProducts",isAuthenticatedUser,productController.getAllProducts)
router.get('/getProductDetails/:id',productController.getProductDetails)




module.exports=router