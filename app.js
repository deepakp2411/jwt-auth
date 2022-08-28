import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import connectDB from "./config/connectdb.js";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
const app = express();
const port = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

// Cors Policy
app.use(cors());

app.use(cookieParser());

// connect db
connectDB(DATABASE_URL);

// JSON
app.use(express.json());

// Load Routes
app.use("/api/user", userRoutes);

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
