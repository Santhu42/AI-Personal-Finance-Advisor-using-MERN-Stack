import express from "express";
import multer from "multer";
import csv from "csvtojson";
import fs from "fs";
import path from "path";
import Transaction from "../models/Transaction.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// ===============================
// Ensure uploads directory exists
// ===============================
const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ===============================
// Multer configuration
// ===============================
const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// ===============================
// CSV Upload Route
// POST /upload
// ===============================
router.post("/", auth, upload.single("file"), async (req, res) => {
  console.log("📥 /upload hit");
  console.log("📄 file:", req.file?.originalname);

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const rows = await csv().fromFile(req.file.path);

    const transactions = rows
      .filter(row => row.description && row.amount)
      .map(row => ({
        userId: req.user.id,
        date: row.date ? new Date(row.date) : new Date(),
        description: row.description.trim(),
        amount: Number(row.amount),
        category: row.category ? row.category.trim() : "Uncategorized"
      }))
      .filter(t => !isNaN(t.amount));

    if (transactions.length === 0) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "No valid transactions found" });
    }

    await Transaction.insertMany(transactions);

    // Cleanup uploaded file
    fs.unlinkSync(req.file.path);

    res.json({
      message: `CSV uploaded successfully. ${transactions.length} transactions added.`
    });

  } catch (err) {
    console.error("❌ CSV upload error:", err);

    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ message: "CSV upload failed" });
  }
});

export default router;
