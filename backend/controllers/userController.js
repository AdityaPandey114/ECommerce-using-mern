const userSchema=require('../models/userModels')
const sendToken = require('../utils/JWTToken')
const ErrorHandler=require("../utils/errorHandler")
const bcrypt=require('bcryptjs')
const crypto=require('crypto')
const {sendEmail}=require('../utils/sendEmails.js')
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


        sendToken(newuser,201,res);

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

        if(!email || !password) return next(new ErrorHandler("Enter Your Email or Password",400))

        const user=await userSchema.findOne({email:email}).select("+password");

        if(!user) next(new ErrorHandler("No user found",404))

        const passwordCompare= await user.comparePassword(password)
        if(!passwordCompare){
            return next(new ErrorHandler("Invalid Email or Password",401));
        } //401 ->unautharized
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

exports.forgotPassword=async (req,res,next)=>{
    try{
        const user=await userSchema.findOne({email:req.body.email}) 
        if(!user){
            return next(new ErrorHandler("User Not Found"))
        }
        const resetToken=await user.getResetPasswordToken();
        await user.save({validateBeforeSave:false})

        const resetPasswordUrl=`${req.protocol}://${req.get("host")}/api/v1/user/resetPassword/${resetToken}`;
        const message=`YOUR PASSWORD RESET TOKEN IS:- \n\n ${resetPasswordUrl}`

        sendEmail({
            email:user.email,
            subject:'ecomerce Website Password recovery',  
            message,
        })

        res.json(200).status({
            success:true,
            message:`Email sent to ${user.email} successfully`
        })
    }
    catch(error){
        console.log(error);
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;
        await user.save({validateBeforeSave:false})
        return next(new ErrorHandler(error.message,500));


    }

}

//reset password
exports.resetPassword= async (req,res,next)=>{
    try {
        const resetPasswordToken=crypto.createHash("sha256").update(req.params.resetToken).digest("hex");
        const user=await userSchema.findOne({
            resetPasswordToken,
            resetPasswordExpire: {$gt:Date.now()}
        })
        if(!user){
            return next(new ErrorHandler("Reset PAssword TOken id invalid or has  been expired",400))
        }

        if(req.body.password!==req.body.confirmPassword){
            return next(new ErrorHandler("passowrd dosn't match the confirm password",400))
        }
        user.password=req.body.password;
        console.log(user.password);
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;
        await user.save();
        sendToken(user,200,res)

    } catch (error) {
        console.log(error);
    }
}

//get userr detail
exports.getUserDetails=async (req,res,next)=>{
    try {
        const user=await userSchema.findById(req.user.id);
        res.status(200).json({
            success:true,
            data:user
        })

    } catch (error) {
        next(new ErrorHandler(error,500))
    }
}



exports.updatePassword= async (req,res,next)=>{
    try {
       
        const user=await userSchema.findById(req.user.id).select("+password");
        const isPasswordMAtched=await user.comparePassword(req.body.oldPassword);
        if(!isPasswordMAtched){
            return next(new ErrorHandler("incorrect password",401))
        }
        user.password=req.body.newPassword;
        user.save();
        sendToken(user,200,res);

        
    } catch (error) {
        next(new ErrorHandler(error,500))
    }
}
exports.updateUserProfile=async (req,res,next)=>{
    try {
        const newUserDetails={
            name:req.body.name,
            email:req.body.email
        }
        const user=await userSchema.findByIdAndUpdate(req.user.id,newUserDetails,{
            new:true,
            runValidators:true,
            useFindAndModify:false
        })

        sendToken(user,200,res)
    } catch (error) {
        
    }
}