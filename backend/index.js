import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import dotenv from "dotenv";
import connectDB from "./utils/db.js";
dotenv.config({});

import userRoute from "./routes/user.model.js";
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser);

const corsOptions = {
  origin: "http//localhost:5173",
  Credential: true,
};
app.use(cors(corsOptions));
const PORT = process.env.PORT || 3900;

app.use("/api/v1/user", userRoute);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running at port ${PORT}`);
});
