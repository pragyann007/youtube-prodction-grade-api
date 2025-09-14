import express from "express"
import { deleteVideo,  getallVideo, updateVideo, upload } from "../controllers/videoController";
import { auth } from "../middlewares/auth";

const videoRoute = express.Router();

videoRoute.post("/upload",auth,upload);
videoRoute.put("/update:id",auth,updateVideo);
videoRoute.delete("/delete:id",auth,deleteVideo);
videoRoute.get("/all",auth,getallVideo);

