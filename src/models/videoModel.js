import mongoose, { mongo } from "mongoose";

const videoSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        trim:true
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    videoUrl:{
        type:String,
        required:true,
        trim:true
    },
    videoId:{
        type:String,
        required:true,
        trim:true
    },
    thumbnailUrl:{
        type:String,
        required:true,
        trim:true

    },
    thumbnailId:{
        type:String,
        required:true,
        trim:true
    },
    category:{
        type:String,
        required:true,
        trim:true
    },
    tags:[
        {
            type:String,
            trim:true
        }
    ],
    likedBy:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",

        }
    ],
    dislikedBy:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    viewedBy:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ]

    
},{timestamps:true})

// virtual field for like dislike and views 

videoSchema.virtual("likes").get(function(){
    return this.likedBy.length ;
})

videoSchema.virtual("dislikes").get(function(){
    return this.dislikedBy.length;
})

videoSchema.virtual("views").get(function(){
    return this.viewedBy.length;
})


videoSchema.set("toJSON",{
    virtuals:true
})

export const Video = mongoose.model("Video",videoSchema)