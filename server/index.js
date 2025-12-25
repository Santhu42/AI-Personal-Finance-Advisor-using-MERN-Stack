// ===============================
// Load Environment Variables
// ===============================
import dotenv from "dotenv";
dotenv.config();
console.log("OPENAI KEY:", process.env.OPENAI_API_KEY);


console.log("🔑 OPENAI KEY LOADED:", !!process.env.OPENAI_API_KEY);


console.log("🔥 RUNNING THIS index.js FILE 🔥");

// ===============================
// Imports
// ===============================
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// Routes
import authRoutes from "./routes/auth.js";
import transactionRoutes from "./routes/transactions.js";
import uploadRoutes from "./routes/upload.js";
import aiRoutes from "./routes/ai.js"; // 🤖 AI insights route

// Middleware
import authMiddleware from "./middleware/auth.js";

// ===============================
// App Init
// ===============================
const app = express();

// ===============================
// Global Middlewares
// ===============================
app.use(cors());
app.use(express.json());

// ===============================
// MongoDB Connection
// ===============================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// ===============================
// Routes
// ===============================

// Auth routes
app.use("/auth", authRoutes);

// Transactions routes (JWT protected inside)
app.use("/transactions", transactionRoutes);

// CSV upload route (JWT protected inside upload.js)
app.use("/upload", uploadRoutes);

// 🤖 AI insights routes (budget suggestions, saving tips)
app.use("/ai", aiRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Backend working with MongoDB");
});

// Debug upload test route
app.get("/upload-test", (req, res) => {
  res.send("UPLOAD ROUTE IS REACHABLE");
});

// Example protected route
app.get("/profile", authMiddleware, (req, res) => {
  res.json({
    msg: "Protected route accessed",
    userId: req.user.id
  });
});

// ===============================
// Start Server
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
