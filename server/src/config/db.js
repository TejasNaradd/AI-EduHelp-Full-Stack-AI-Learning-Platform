//how to connect db in separate file look code modular

import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB=async ()=>{
    try{
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`\n MogoDb connected !! Db host: ${connectionInstance.connection.host}`)
    }
    catch(error){
        console.log("Connection error ",error)
        process.exit(1)
    }
}

export default connectDB