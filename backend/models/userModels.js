const mongoose =require('mongoose')
const validator=require('validator');
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
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
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,

    })
    
}
userSchema.methods.comparePassword= async function(password){
    return await bcrypt.compare(password,this.password)
}
module.exports=mongoose.model('userSchema',userSchema);