import cloudinary from "../config/cloudinary.js";
import { User } from "../models/userModels.js";
import bcrypt, { compare } from "bcryptjs"
import jwt from "jsonwebtoken"

export const register = async (req,res)=>{
    try {
        const {channelName,email,password,phone} = req.body ;
    
        if(!channelName || !email || !password || !phone){
            return res.status(400).json({sucess:false,message:"Empty Credentials  "})
        }
    
        const user = await User.findOne({email});
        if(user) {
            return res.status(401).json({sucess:false,message:"Account already exists , please login "})
    
    
        }
        const hashedPassword = await bcrypt.hash(password,12)

        console.log("hii")
    
        
            // const uploadImage = await cloudinary.uploader.upload(
            //     req.files.logoUrl.tempFilePath
            // )
        
            console.log("hii2")

      
        const newUser = await User.create({
            channelName,
            email,
            phone,
            password:hashedPassword,
            // logoUrl:uploadImage.secure_url,
            // logoId:uploadImage.public_id
        })
    
        return res.status(201).json({sucess:true,message:"User registered sucessfully !!",newUser})
    } catch (error) {
        return res.status(400).json({sucess:false,message:"Error in user contoller in server ..",error})
        
    }

}

export const login = async (req,res)=>{
    const {email,password } = req.body ; 

    if(!email||!password){
        return res.status(400).json({sucess:false , message:"Empty Credentials ."})
    }
    
    const userExists = await User.findOne({email});

    if(!userExists){
        return res.status(400).json({sucess:false,message:"User not registered !"});

    }

    const comparePassword = await bcrypt.compare(password,userExists.password);

    if(!comparePassword){
        return res.status(400).json({sucess:false,message:"Invalid Credentials .."})
    }

    const token = jwt.sign({
        _id:userExists._id,
        channelName:userExists.channelName,
        email:userExists.email,
        phone:userExists.phone,
        logoId:userExists.logoId
    },process.env.JWT_SECRET,{expiresIn:"7d"})

    res.cookie("token",token,{
        httpOnly: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
      })

    return res.status(200).json({sucess:true,message:"User logged in sucessfully ",

        userExists,
        token
    })

    
}

export const updateProfile = async (req,res)=>{

    try {

        const {channelName,phone} = req.body ; 

        const updatedData = {channelName,phone}

        // if(req.files && req.files.logoUrl){
        //     const uploadedImage = await cloudinary.uploader.upload(req.files.logoUrl.tempFilePath);
        //     updatedData.logoUrl = uploadedImage.secure_url;
        //     updatedData.logoId = uploadedImage.public_id
        //   }

        const updatedUser = await User.findByIdAndUpdate(req.user._id,updatedData,{new:true})

        res.status(200).json({sucess:true,message:"User updated sucessfully",updatedUser})

        
    } catch (error) {
        res.status(500).json({sucess:false,message:"Error in update profile contoller "})
    }


}

export const subscribe = async (req,res)=>{

    try {

        const {channelId} = req.body ;

        if(req.user._id==channelId){
            return res.status(401).json({sucess:false,message:"You cant subscribe your own channel"})
        }

        const currentUser = await User.findByIdAndUpdate(req.user._id,{$addToSet:{subscribedChannels:channelId}})

        const subscribedUser = await User.findByIdAndUpdate(channelId,{$inc:{subscribers:1}})

        res.status(200).json({
            sucess:true,
            message:"subscribed sucessfully !",
            data:{
                subscribedUser,
                currentUser

            }
        })
        
    } catch (error) {
        return res.status(500).json({sucess:false,message:"Error in subscribe",error})
        
    }

}