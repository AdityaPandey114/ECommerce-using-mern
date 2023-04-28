const express=require('express')
const router=express.Router()
const userController=require('../controllers/userController')
const { isAuthenticatedUser , autharizedRoles} = require('../middleware/auth')

router.post('/createUser',userController.registerUser)
router.post('/login',userController.login)
router.get('/logout',userController.logout)
router.get('/getUserDetails',isAuthenticatedUser,userController.getUserDetails)
router.post('/forgotPassword',userController.forgotPassword)
router.post('/updatePassword',isAuthenticatedUser,userController.updatePassword)
router.post('/updateProfile',isAuthenticatedUser,userController.updateUserProfile)
router.post('/resetPassword/:resetToken',userController.resetPassword)
module.exports=router