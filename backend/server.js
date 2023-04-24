const app=require('./app')
const dotenv=require('dotenv');
const connectDataBase=require("./config/database")

//config
dotenv.config({path:"backend/config/config.env"})

process.on("uncaughtException",(err)=>{
    console.log("Error Message",err.message);
    console.log("Shutting down the server due to uncaught Exception");
    process.exit(1)
    
})

//connecting to the database
connectDataBase()

const server=app.listen(process.env.PORT,(req,res)=>{
    console.log("Server is working on port : ",process.env.PORT);
})



// unhandled promise rejection
process.on("unhandledRejection",(err)=>{
    console.log("Error Message",err.message);
    console.log("Shutting down the server due to unhandeled rejections");
    server.close(()=>{
        process.exit(1)
    })
})