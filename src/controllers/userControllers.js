import cloudinary from "../config/cloudinary.js";
import { User } from "../models/userModels.js";
import bcrypt from "bcryptjs"

export const register = async (req,res)=>{
    try {
        const {channelName,email,password,} = req.body ;
    
        if(!channelName || !email || !password){
            return res.status(400).json({sucess:false,message:"Empty Credentials  "})
        }
    
        const user = await User.find({email});
        if(user) {
            return res.status(401).json({sucess:false,message:"Account already exists , please login "})
    
    
        }
        const hashedPassword = await bcrypt.hash(password,12)
    
    
        const uploadImage = await cloudinary.uploader.upload(
            req.files.logoUrl.tempFilePath
        )
        const newUser = await User.create({
            channelName,
            email,
            password:hashedPassword,
            logoUrl:uploadImage.secure_url,
            logoId:uploadImage.public_id
        })
    
        return res.status(201).json({sucess:true,message:"User registered sucessfully !!",newUser})
    } catch (error) {
        return res.status(400).json({sucess:false,message:"Error in user contoller in server .."})
        
    }

}