import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// register
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
});


// login
router.post("/login", async (req, res) => {
  try {
    console.log("📥 LOGIN BODY:", req.body);

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    console.log("👤 USER FOUND:", !!user);

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("🔐 STORED HASH:", user.password);
    console.log("🔑 PASSWORD ENTERED:", password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("✅ PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    console.error("❌ LOGIN ERROR:", err);
    res.status(500).json({ message: "Login failed" });
  }
});




export default router;   // ✅ THIS LINE IS CRITICAL
