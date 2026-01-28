import express from "express";
import OpenAI from "openai";
import auth from "../middleware/auth.js";
import Transaction from "../models/Transaction.js";

const router = express.Router();

// Only initialize OpenAI if key exists
const openai =
  process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

router.get("/insights", auth, async (req, res) => {
  try {
    if (!openai) {
      return res.json({
        insights:
          "AI insights are temporarily unavailable. Please configure OpenAI billing."
      });
    }

    const transactions = await Transaction.find({ userId: req.user.id });

    if (transactions.length === 0) {
      return res.json({
        insights: "No transactions available for AI analysis."
      });
    }

    const summaryText = transactions
      .map(t => `${t.category}: ${t.amount}`)
      .join(", ");

    const prompt = `
You are a personal finance advisor.
Analyze the transactions and provide:
1. Spending pattern analysis
2. Budget suggestions
3. Saving tips

Transactions:
${summaryText}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }]
    });

    res.json({
      insights: response.choices[0].message.content
    });

  } catch (err) {
    console.error("AI ERROR:", err.message);

    // 🔥 HANDLE QUOTA ERROR CLEANLY
    if (err.status === 429) {
      return res.json({
        insights:
          "AI quota exceeded. Please check OpenAI billing or try again later."
      });
    }

    res.json({
      insights:
        "AI insights are temporarily unavailable. Please try again later."
    });
  }
});

export default router;
