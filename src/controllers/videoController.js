
import express from "express";
import mongoose from "mongoose";
import { User } from "../models/userModels.js";
import cloudinary from "../config/cloudinary.js";
import { Video } from "../models/videoModel.js";

export const upload = async (req, res) => {

    try {
        const { title, description, category, tags, } = req.body;

        if (!req.files || !req.files.videoUrl || !req.files.thumbnailUrl) {
            return res.status(400).json({ sucess: false, message: "Please upload all files .. " })
        }

        const videoUpload = await cloudinary.uploader.upload(req.files.videoUrl.tempFilePath, {
            resource_type: "video",
            folder: "videos"
        });
        const thumbnailUpload = await cloudinary.uploader.upload(req.files.thumbnailUrl.tempFilePath, {
            resource_type: "image",
            folder: "thumbnails"
        })

        const newVideo = new Video({
            title,
            description,
            category,
            tags: tags ? tags.split(",") : [],
            user_id: req.user._id,
            videoUrl: videoUpload.secure_url,
            videoId: videoUpload.public_id,
            thumbnailUrl: thumbnailUpload.secure_url,
            thumbnailId: thumbnailUpload.public_id,
        })

        await newVideo.save();

        res.status(200).json({
            sucess: true,
            message: "Video uploaded sucess ",
            newVideo
        })


    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error uploading video",
            error: error.message
        });

    }
}

export const updateVideo = async (req, res) => {
    try {
        const { title, description, category, tag } = req.body;
        const videoId = req.params.id;

        let video = await Video.findById(videoId);

        if (!video) {
            return res.status(400).json({
                sucess: false,
                message: "No video found of this id .."
            })
        }

        if (videoId.user_id.toString() !== req.user._id) {
            return res.status(403).json({
                sucess: false,
                message: "You are unauthorised , this video is not of yours !"
            })
        }

        if (req.files && req.files.thumbnail) {
            await cloudinary.uploader.destroy(video.thumbnailId);

            const thumbnailUpload = await cloudinary.uploader.upload(req.files.thumbnail.tempFilePath, {
                resource_type: "image",
                folder: "thumbnail"
            })

            video.thumbnailUrl = thumbnailUpload.secure_url;
            video.thumbnailId = thumbnailUpload.public_id;


        };

        // update fields
        video.title = title;
        video.description = description;
        video.tags = tag;
        video.category = category;

        await video.save();

        res.status(200).json({
            sucess: false,
            message: "Video updated sucessfully !!"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            sucess: false,
            message: "Server error in updating video .."
        })

    }




}

// delete ...
export const deleteVideo = async () => {
    try {
        const videoId = req.params.id

        if (!videoId) {
            return res.status(400).json({
                sucess: false,
                message: "No id found .. "
            })
        }

        const video = await Video.findById(videoId);

        if (!video) {

            return res.status(400).json({
                sucess: false,
                message: "No video found  .. "
            })

        }

        if (video.user_id.toString() !== req.user._id) {

            return res.status(400).json({
                sucess: false,
                message: "You are not authorised to delete this video .."
            })

        }

        await cloudinary.uploader.destroy(video.videoId, { resource_type: "video" });
        await cloudinary.uploader.destroy(video.thumbnailId);

        await Video.findByIdAndDelete(videoId);

        res.status(200).json({
            sucess: true,
            message: "Deleted sucessfully !"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ sucess: false, message: "Error in server while deleting video .." })

    }



}

export const getallVideo = async (req, res) => {

    try {
        const videos = await Video.find();

        res.status(200).json({
            sucess: true,
            message: "Video send sucess .. ",
            videos
        })
    } catch (error) {
        res.status(500).json({
            sucess: false,
            message: "Server error while sending all videos "
        })

    }

}

export const myVideo = async (req, res) => {
    try {

        const userId = req.users._id;
        const video = await Video.find({ user_id: userId }).sort({ createdAt: -1 });

        return res.status(200).json({ sucess: true, message: "My videos fetched sucess", video })





    } catch (error) {

        console.log(error)
        return res.status({
            sucess: false,
            message: "Server error while fetching my videos..",
            error
        })


    }
}

// get all video and push viewed by 

export const getVideoById = async (req, res) => {

    try {
        const videoId = req.params.id;
    
        const userId = req.users._id;
    
        const video = await Video.findByIdAndUpdate(videoId, {
            $addToSet: {
                viewedBy: userId
            },
    
        }, { new: true })
    
        if(!video) return res.status(400).json({sucess:false,message:"Video not found !"})
    
        return res.status(200).json({sucess:true,
            message:"Video found sucess ..",
            video
        })
    } catch (error) {
        
        console.log("\n \n Error in getting video by id  '",error)

        return res.status(400).json({
            sucess:false,
            message:"Error while getting video by id"
        })
    }
}

// get video by category 

export const getVideoByCategory = async(req,res)=>{
   try {
     const category = req.params.category ; 
 
     const video = await Video.find({category}).sort({createdAt:-1})
 
     if(!video)  return res.status(400).json({sucess:false,message:"Vieo not found of your category .. "})
 
     return res.status(200).json({
         sucess:true,
         message:"Video found sucessfylly of given category ...",
         video
     })
   } catch (error) {
    
    console.log("\n \n error while gettingvideo by categories  \n" , error )
   }

}

// get videos by tags 

export const getVideoByTags = async (req,res)=>{

    try {
        const tags = req.params.tag ; 

        const video = await Video.find({tags}).sort({createdAt:-1});

        return res.status(200).json({
            sucess:true,
            message:"Video found sucess ... ",
            video
        })
        
    } catch (error) {
        console.log("\n \n error while getting video by tags \n ", error)
        res.status(400).json({
            sucess:false,
            message:"Error while getting video by tags ..",

        })
        
    }

}

// video like 

export const likevideo = async(req,res)=>{
    try {
        const userId = req.user._id
        const {videoId} = req.body ; 
        if(!videoId){
            return res.status(400).json({
                sucess:false,
                message:"Video id not sentt .."
            })
        }
        const video = await Video.findByIdAndUpdate(videoId,{
            $addToSet:{likedBy:userId},
            $pull:{dislikedBy:userId}
        })
    
        return res.status(200).json({sucess:true,message:"Video liked ..",video})
    } catch (error) {
        console.log("error while liking video " , error);

        return res.status(400).json({
            sucess:false,message:"error while liking video .. "
        })
        
    }
}

// video dislike 

export const dislikevideo = async(req,res)=>{
    try {
        const userId = req.user._id
        const {videoId} = req.body ; 
        if(!videoId){
            return res.status(400).json({
                sucess:false,
                message:"Video id not sentt .."
            })
        }
        const video = await Video.findByIdAndUpdate(videoId,{
            $addToSet:{dislikedBy:userId},
            $pull:{likedBy:userId}
        })
    
        return res.status(200).json({sucess:true,message:"Video disliked ..",video})
    } catch (error) {
        console.log("error while disliking video " , error);

        return res.status(400).json({
            sucess:false,message:"error while disliking video .. "
        })
        
    }
}