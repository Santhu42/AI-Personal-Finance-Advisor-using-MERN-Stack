import express from "express";
import multer from "multer";
import csv from "csvtojson";
import fs from "fs";
import path from "path";
import Transaction from "../models/Transaction.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// ===============================
// Ensure uploads folder exists
// ===============================
const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ===============================
// Multer Configuration
// ===============================
const upload = multer({
  dest: uploadDir
});

// ===============================
// CSV Upload Route
// POST /upload
// ===============================
router.post("/", auth, upload.single("file"), async (req, res) => {
  console.log("📥 /upload hit");
  console.log("📄 file:", req.file);

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const rows = await csv().fromFile(req.file.path);

    // ===============================
    // Normalize + validate rows
    // ===============================
    const transactions = rows
      .filter(row => row.description && row.amount) // skip empty rows
      .map(row => ({
        userId: req.user.id,
        date: row.date ? new Date(row.date) : new Date(),
        description: row.description.trim(),
        amount: Number(row.amount), // 🔥 ENSURE NUMBER
        category: row.category ? row.category.trim() : "Uncategorized"
      }))
      .filter(t => !isNaN(t.amount)); // skip invalid numbers

    if (transactions.length === 0) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "No valid transactions found" });
    }

    await Transaction.insertMany(transactions);

    // ===============================
    // Cleanup uploaded file
    // ===============================
    fs.unlinkSync(req.file.path);

    res.json({
      message: `CSV uploaded successfully. ${transactions.length} transactions added.`
    });

  } catch (err) {
    console.error("❌ CSV ERROR:", err);

    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ message: "CSV upload failed" });
  }
});

export default router;
