import {Comment} from "../models/commentsModel.js"


export const newComment = async (req,res)=>{
    try {
        const {videoId,comment} = req.body ;
    
        if(!videoId||!comment){
            return res.status(400).json({sucess:false,message:"Video id and comment is required .  "})
        }
    
        const newComment = new Comment({
            videoId,
            comment,
            userId:req.user._id 
            
        })
    
        await newComment.save();
    
        res.status(200).json({
            sucess:true,
            message:"Commeted sucessfully ..",
            newComment
        })
    } catch (error) {
        console.log("Error while commenting" , error);

        return res.status(400),json({
            sucess:false,
            message:"error while commenting",
            error
        })
        
    }

}

export const deleteComment = async (req,res)=>{
    try {
        const commentId = req.params.commentId ;
    
        const comment = await Comment.findById(commentId)
    
        if (comment.toString() !== req.user._id.toString() ){
    
            return res.status(403).json({sucess:false,message:"Unauthorised acess .."})
    
        }
    
        await comment.findByIdAndDelete(commentId);
    
        return res.status(200).json({sucess:true,message:"Comment deleted sucess !",comment})
    } catch (error) {
        console.log("Error while deleting comment" , error);

        return res.status(400),json({
            sucess:false,
            message:"error while deleting comment",
            error
        })
        
    }

}

export const updateComment = async (req,res)=>{
    try {
        const {commentId} = req.params;
        const {comment} = req.body ; 
    
        const findcomment = await Comment.findByIdAndUpdate(commentId);
    
        if(!comment){
            return res.status(400).json({sucess:false,message:"Comment must be provided"})
        }
    
        if(findcomment.userId.toString() !== req.user._id ){
            return res.status(400).json({
                sucess:false,
                message:"Unauthorised acess "
            })
        }
    
        findcomment.comment = comment ;
        await findcomment.save();
         return res.status(200).json({
            sucess:true,
            message:"updated comment",
            findcomment
         })
    
    } catch (error) {
        console.log("Error while updating  comment" , error);

        return res.status(400),json({
            sucess:false,
            message:"error while updating  comment",
            error
        })
        
    }
}

export const getAllComment = async (req,res)=>{

    try {
        const videoId = req.params.videoId
        const comments = await Comment.find({videoId}).populate("userId","channelName","logoUrl").sort({createdAt:-1});
    
        res.status(200).json({comments})
    } catch (error) {
        console.log("Error while getting comment" , error);

        return res.status(400),json({
            sucess:false,
            message:"error whilegetting comment",
            error
        })
        
    }
}