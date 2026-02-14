import dotenv from 'dotenv'
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import connectDB from "./config/db.js";
import app from "./app.js";

dotenv.config({ 
    path: "./.env", 
    quiet:true
 });


connectDB() //since async function thereore it returns promise
.then(()=>
    {
        app.on("error",(error)=>{
        console.log('ERR: ',error)
        throw error
         })
    app.listen(process.env.PORT || 8000,()=>{
       console.log(`Server is running at port : ${process.env.PORT}`) 
    })
})
.catch((error)=>{
    console.log("Failed to connect DB , exiting now...",error)
})
