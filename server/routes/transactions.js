import express from "express";
import mongoose from "mongoose"; // 🔥 REQUIRED
import Transaction from "../models/Transaction.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/* ===============================
   ADD TRANSACTION
================================ */
router.post("/", auth, async (req, res) => {
  try {
    const { description, amount, category, date } = req.body;

    const transaction = new Transaction({
      userId: req.user.id,
      description,
      amount: Number(amount), // 🔥 FORCE NUMBER
      category,
      date: date ? new Date(date) : new Date()
    });

    await transaction.save();
    res.status(201).json(transaction);

  } catch (err) {
    console.error("ADD ERROR:", err);
    res.status(500).json({ msg: "Failed to add transaction" });
  }
});

/* ===============================
   GET USER TRANSACTIONS
================================ */
router.get("/", auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req.user.id
    }).sort({ date: -1 });

    res.json(transactions);

  } catch (err) {
    console.error("FETCH ERROR:", err);
    res.status(500).json({ msg: "Failed to fetch transactions" });
  }
});

/* ===============================
   DELETE TRANSACTION
================================ */
router.delete("/:id", auth, async (req, res) => {
  try {
    await Transaction.deleteOne({
      _id: req.params.id,
      userId: req.user.id
    });

    res.json({ msg: "Transaction deleted" });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ msg: "Delete failed" });
  }
});

/* ======================================================
   CATEGORY-WISE TOTALS
   GET /transactions/categories
====================================================== */
router.get("/categories", auth, async (req, res) => {
  try {
    const data = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.id)
        }
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      }
    ]);

    res.json(data);

  } catch (err) {
    console.error("CATEGORY ERROR:", err);
    res.status(500).json({ msg: "Category analytics failed" });
  }
});

/* ======================================================
   MONTHLY INCOME vs EXPENSE
   GET /transactions/monthly
====================================================== */
router.get("/monthly", auth, async (req, res) => {
  try {
    const data = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.id)
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          income: {
            $sum: {
              $cond: [{ $gt: ["$amount", 0] }, "$amount", 0]
            }
          },
          expense: {
            $sum: {
              $cond: [{ $lt: ["$amount", 0] }, "$amount", 0]
            }
          }
        }
      }
    ]);

    res.json(data);

  } catch (err) {
    console.error("MONTHLY ERROR:", err);
    res.status(500).json({ msg: "Monthly analytics failed" });
  }
});

/* ======================================================
   SUMMARY (INCOME, EXPENSE, BALANCE)
   GET /transactions/summary
====================================================== */
router.get("/summary", auth, async (req, res) => {
  try {
    const result = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.id)
        }
      },
      {
        $group: {
          _id: null,
          income: {
            $sum: {
              $cond: [{ $gt: ["$amount", 0] }, "$amount", 0]
            }
          },
          expense: {
            $sum: {
              $cond: [{ $lt: ["$amount", 0] }, "$amount", 0]
            }
          }
        }
      }
    ]);

    const income = result[0]?.income || 0;
    const expense = Math.abs(result[0]?.expense || 0);

    res.json({
      income,
      expense,
      balance: income - expense
    });

  } catch (err) {
    console.error("SUMMARY ERROR:", err);
    res.status(500).json({ msg: "Summary analytics failed" });
  }
});

export default router;
