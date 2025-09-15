import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./config/db.js";
import {userRoute} from "./routes/userRoute.js";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import { videoRoute } from "./routes/videoRoute.js";
import { commentRoute } from "./routes/commentRoute.js";




dotenv.config();
connectDb();


const app = express();
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(fileUpload({
  useTempFiles:true,
  tempFileDir:'/tmp/'
}))

app.use("/api/auth",userRoute)
app.use("/api/video",videoRoute)
app.use("/api/comment",commentRoute)




const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello from Express Starter!");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
