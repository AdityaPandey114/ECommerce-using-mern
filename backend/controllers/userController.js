const userSchema=require('../models/userModels')
const sendToken = require('../utils/JWTToken')
const ErrorHandler=require("../utils/errorHandler")
const bcrypt=require('bcryptjs')
//Register USer
exports.registerUser=async (req,res,next)=>{
    try{
        const {name,email,password,role}=req.body
        const userDetails={
            name,
            email,
            password,
            role,
            avtar:{
                public_id:"this is a sample id",
                url:"profilepic url"
            }
        }
        const newuser= await userSchema.create(userDetails);


        sendToken(user,201,res);

    }
    catch(error){
        console.log(error);
        next(error)
    }
}



//login user
exports.login=async (req,res,next)=>{
    try{
        const {email,password}=req.body

        if(!email || !password) next(new ErrorHandler("Enter Your Email or Password",400))

        const user=await userSchema.findOne({email:email}).select("+password");

        if(!user) next(new ErrorHandler("No user found",404))

        const passwordCompare= user.comparePassword(user.password)

        if(!passwordCompare) next(new ErrorHandler("Incorrect Password",401));
        sendToken(user,200,res);

    }
    catch(error){
        console.log(error);
        next(error)
    }
}

//logout 
exports.logout=async (req,res)=>{
    try
    {
        res.cookie("token",null,{
            expires:new Date(Date.now()),
            httpOnly:true
        })

        res.status(200).json({
            success:true,
            message:"User Loged out"
        })
    }
    catch(error){
        console.log(error);
    }
}