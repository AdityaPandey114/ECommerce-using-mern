const express=require("express")
const app= express()
const errorMiddleware=require("./middleware/error")
const cookieParser=require('cookie-parser')
app.use(express.json())
app.use(cookieParser())
//Routes import
const product=require('./routes/productRoutes')
const user=require('./routes/userRoutes')



app.use('/api/v1/product',product)
app.use('/api/v1/user',user)

//middleware for error
app.use(errorMiddleware)

module.exports=app