const mongoose=require("mongoose");
const productSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter Product name"],
        trim:true
    },
    description:{
        type:String,
        required:[true,"Please Enter Product description"]
    },
    price:{
        type:Number,
        required:[true,"Please Enter Product price"],
        maxLength:[6,"price cannot exceed 6 figures"]
    },
    rating:{
        type:Number,
        default:0
    },
    images:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        }
    ],
    category:{
        type:String,
        required:[true,"Please enter product category"]
    },
    Stock:{
        type:Number,
        required:[true,"Please enter product stocks"],
        maxLength:[4,"Stocks size cannot exceed 4 figures"],
        default:1
    },
    numOfReview:{
        type:Number,
        default:0
    },
    reviews:[
        {
            name:{
                type:String,
                required:true
            },
            rating:{
                type:String,
                required:true
            },
            comment:{
                type:String,
                required:true
            }
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now()
    }
});
module.exports=mongoose.model("Product",productSchema)