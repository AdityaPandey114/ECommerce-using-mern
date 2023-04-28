const ProductSchema=require("../models/productModels")
const ErrorHandler=require("../utils/errorHandler")
const ApiFeatures=require('../utils/Apifeatures')
//CreateProducts
exports.createProduct=async (req,res,next)=>{
    try{
        req.body.user=req.user.id
        console.log("I enter product create");
        const product=await ProductSchema.create(req.body)
        console.log("i exit prodtuct create");
        res.status(200).json({success:true,data:product})
    }
    catch(error){
        console.log(error);
        res.status(404).json({success:true,data:error.message})
    }
}

exports.updateProduct=async (req,res)=>{
    try{
        const productid=req.params.id
        const product=await ProductSchema.find({_id:productid})
        if(!product){
            return res.status(500).json({
                success:false,
                message:"Product not found"
            })
        }
        const updatedProduct=await ProductSchema.findByIdAndUpdate({_id:productid},req.body,{
            new:true,runValidators:true,useFindAndModify:false
        })
        return res.status(200).json({
            success:true,
            data:updatedProduct
        })
    }
    catch(error){
        console.log(error)
        res.status(404).json({success:true,data:error.message})
    }
}



exports.deleteProduct=async (req,res,next)=>{
    try{
        const productid=req.params.id
        const product=await ProductSchema.find({_id:productid})
        if(!product){
            return res.status(500).json({
                success:false,
                message:"Product not found"
            })
        }
        await ProductSchema.findByIdAndDelete({_id:productid})
        return res.status(200).json({
            success:true,
            message:"Product delete"
        })
    }   
    catch(error){
        console.log(error)
        next(new ErrorHandler(error,404))
    }
}


exports.getProductDetails=async (req,res,next)=>{
    try{
        const productid=req.params.id;
        const product=await ProductSchema.findById(productid)
        if(!product){
            return next(new ErrorHandler("Product not found",404))
        }
        res.status(200).json({
            success:true,
            data:product
        })
    }
    catch(error){
         next(new ErrorHandler(error,404))
    }
}


exports.getAllProducts=async (req,res)=>{
    const resultPerPage=5
    const productCount= await ProductSchema.countDocuments()
    console.log(req.query);
    const apifeature=new ApiFeatures(ProductSchema.find({}),req.query).search().pagination(resultPerPage).filter()
    const allProducts=await apifeature.query;

    res.status(200).json({
        success:true,
        data:allProducts,
        productCount
    })
}