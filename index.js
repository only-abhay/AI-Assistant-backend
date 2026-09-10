import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";

import UserRouter from "./routes/userRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import QandARoutes from "./routes/QandARoutes.js";

import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

app.use(cookieParser());

const PORT = process.env.PORT || 5000;

// ================================
// Middlewares
// ================================

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://YOUR-FRONTEND.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================================
// Health Check
// ================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running...",
  });
});

// ================================
// Routes
// ================================

app.use("/api/blog", blogRoutes);
app.use("/api/resume", QandARoutes);
app.use("/api/user", UserRouter);

// ================================
// Error Middleware
// ================================

app.use(notFound);
app.use(errorHandler);

// ================================
// Database + Server
// ================================

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server Start Error:", error);
    process.exit(1);
  }
};

startServer();