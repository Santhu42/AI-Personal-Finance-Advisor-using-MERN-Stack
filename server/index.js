// ===============================
// Load Environment Variables
// ===============================
import dotenv from "dotenv";
dotenv.config();

console.log("🔑 OPENAI KEY LOADED:", !!process.env.OPENAI_API_KEY);
console.log("🔥 RUNNING index.js 🔥");

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
import aiRoutes from "./routes/ai.js";

// Middleware
import authMiddleware from "./middleware/auth.js";

// ===============================
// App Init
// ===============================
const app = express();

// ===============================
// CORS CONFIG (🔥 CRITICAL FIX)
// ===============================
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://ai-personal-finance-advisor-using-mern-stack.netlify.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

// Handle preflight requests
app.options("*", cors());

app.use(express.json());

// ===============================
// MongoDB Connection
// ===============================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// ===============================
// Routes
// ===============================
app.use("/auth", authRoutes);
app.use("/transactions", transactionRoutes);
app.use("/upload", uploadRoutes);
app.use("/ai", aiRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Backend working with MongoDB");
});

// Upload test
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
