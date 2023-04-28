const mongoose =require('mongoose')
const validator=require('validator');
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const crypto=require("crypto")
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter your name"],
        maxLength:[30,"NO Name should exceed 30 Char"],
        minLength:[4,"name should have more than 3 character"]
    },
    email:{
        type:String,
        required:[true,"Please enter your email"],
        unique:true,
        validate:[validator.isEmail,"Please enter a valid email"]

    },
    password:{
        type:String,
        required:[true,"Please enter your Password"],
        maxLength:[300,"NO Password should exceed 30 Char"],
        minLength:[8,"Password should have more than 7 character"],
        select:false
    },
    avtar:{
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
    },
    role:{
        type:String,
        default:"user"
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,

})
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next()
    }
    this.password=await bcrypt.hash(this.password,10);
})

userSchema.methods.getJWTToken=function(){
    const token=jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,

    })
    console.log("token :: ",token);
    return token
    
}
userSchema.methods.comparePassword= async function(password){
    const passwordCompare= await bcrypt.compare(password,this.password);
    return passwordCompare;
}

userSchema.methods.getResetPasswordToken=function(){
    //Generate token
    const resetToken=crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire=Date.now()+15*60*1000
    return resetToken;
}
module.exports=mongoose.model('userSchema',userSchema);
//SHA 256 is a part of the SHA 2 family of algorithms, where SHA stands for Secure Hash Algorithm