import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import imageRoutes from "./routes/images.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://subhendu-creativeshowcase.vercel.app"
    ],
    credentials: true,
  })
);


app.use("/api/auth", authRoutes);
app.use("/api/images", imageRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
