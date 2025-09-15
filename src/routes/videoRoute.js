import express from "express"
import { deleteVideo,  dislikevideo,  getallVideo, getVideoByCategory, getVideoById, getVideoByTags, likevideo, myVideo, updateVideo, upload } from "../controllers/videoController";
import { auth } from "../middlewares/auth";

const videoRoute = express.Router();

videoRoute.post("/upload",auth,upload);
videoRoute.put("/update:id",auth,updateVideo);
videoRoute.delete("/delete:id",auth,deleteVideo);
videoRoute.get("/all",auth,getallVideo);
videoRoute.get("/my-video",auth,myVideo);
videoRoute.get("/",auth,getVideoById);
videoRoute.get("/category:category",getVideoByCategory);
videoRoute.get("/tags:tag",getVideoByTags);
videoRoute.post("/like",auth,likevideo)
videoRoute.post("/dislike",auth,dislikevideo);