const ErrorHandler = require("../utils/errorHandler");
const jwt=require('jsonwebtoken')
const userSchema=require('../models/userModels')

exports.isAuthenticatedUser= async (req,res,next)=>{
    try
    {
        const {token}=req.cookies
        if(!token){
             next(new ErrorHandler("Please login to access the resources",401))
        }
        console.log("token : ",token );
        const decodedData=await jwt.verify(token,process.env.JWT_SECRET)
        req.user=await userSchema.findById(decodedData.id)

        next()
    }
    catch(error){

    }
}