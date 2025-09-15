import express from "express"
import { auth } from "../middlewares/auth.js";
import { deleteComment, getAllComment, newComment, updateComment } from "../controllers/commentsController.js";

export const commentRoute = express.Router();

commentRoute.post("/new",auth,newComment);
commentRoute.delete("/delete:commentId",auth,deleteComment);
commentRoute.put("/update/:updateId",auth,updateComment);
commentRoute.get("/",getAllComment)