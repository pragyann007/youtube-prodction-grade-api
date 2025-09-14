import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    channelName:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    logoUrl:{
        type:String,
        default:""
    },
    logoId:{
        type:String,
        default:""
    },
    subscribers:{
        type:Number,
        default:0
    },
    subscribedChannels:{
        type:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            }
        ]
    }

},{timestamps:true})

export const User = mongoose.model("User",userSchema)

