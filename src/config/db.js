import mongoose  from "mongoose";


const connectDb = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Db connected sucess .. ")
        
    } catch (error) {
        console.log("\n Error while connecting to Db \n \n \n ",error)
        
    }
}

export default connectDb