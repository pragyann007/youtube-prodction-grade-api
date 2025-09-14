import express from "express"
import { register } from "../controllers/userControllers.js";

export const userRoute = express.Router();

userRoute.post("/register",register);
userRoute.get("/")

