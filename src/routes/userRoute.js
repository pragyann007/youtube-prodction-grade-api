import express from "express"
import { login, register, subscribe, updateProfile } from "../controllers/userControllers.js";
import { auth } from "../middlewares/auth.js";

export const userRoute = express.Router();

userRoute.post("/register",register);
userRoute.post("/login",login);
userRoute.put("/update-profile",auth,updateProfile);
userRoute.post("/subscribe",auth,subscribe);

