import mongoose, { mongo } from "mongoose";

const commentSchema = new mongoose.Schema({
    videoId:{
        type:mongoose.Schema.Types.ObjectId ,
        ref:"Video"
    },
    comment:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

export const Comment = mongoose.model("Comment",commentSchema)