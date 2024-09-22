import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import dotenv from "dotenv";

dotenv.config({});
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

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
