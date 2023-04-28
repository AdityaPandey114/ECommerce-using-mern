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
        console.log("decodedData : ",decodedData);
        req.user=await userSchema.findById(decodedData.id)

        next()
    }
    catch(error){

    }
}

exports.autharizedRoles=(...roles)=>{

    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            next(new ErrorHandler(`Role ${req.user.role} is not allowed to access this resource`,403))
        }
        console.log("Roles : ",req.user.role);
        next();
    };
}