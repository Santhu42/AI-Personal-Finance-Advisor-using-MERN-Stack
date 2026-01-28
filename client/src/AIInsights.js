import { useEffect, useState, useCallback } from "react";

function AIInsights({ transactions, summary }) {
  const [insights, setInsights] = useState([]);

  const generateInsights = useCallback(() => {
    const rules = [];

    if (!transactions || transactions.length === 0) {
      rules.push("Add transactions to receive spending insights.");
      setInsights(rules);
      return;
    }

    // 1️⃣ Highest spending category
    const categoryTotals = {};
    transactions.forEach((t) => {
      if (t.amount < 0) {
        categoryTotals[t.category] =
          (categoryTotals[t.category] || 0) + Math.abs(t.amount);
      }
    });

    const highestCategory = Object.keys(categoryTotals).reduce(
      (a, b) => (categoryTotals[a] > categoryTotals[b] ? a : b),
      Object.keys(categoryTotals)[0]
    );

    if (highestCategory) {
      rules.push(
        `You are spending the most on "${highestCategory}". Consider reducing expenses in this category.`
      );
    }

    // 2️⃣ Savings rule
    if (summary.income > 0) {
      const savingsRate = ((summary.balance / summary.income) * 100).toFixed(1);

      if (savingsRate < 20) {
        rules.push(
          `Your savings rate is ${savingsRate}%. Try to save at least 20% of your income.`
        );
      } else {
        rules.push(
          `Great job! Your savings rate is ${savingsRate}%. Keep it up.`
        );
      }
    }

    // 3️⃣ Expense warning
    if (summary.expense > summary.income) {
      rules.push(
        "Your expenses exceed your income. Immediate budget adjustments are recommended."
      );
    }

    setInsights(rules);
  }, [transactions, summary]);

  useEffect(() => {
    generateInsights();
  }, [generateInsights]);

  return (
    <div style={{ padding: "15px", border: "1px solid #ccc", marginTop: "20px" }}>
      <h3>Smart Spending Insights</h3>

      <ul>
        {insights.map((insight, index) => (
          <li key={index}>{insight}</li>
        ))}
      </ul>
    </div>
  );
}

export default AIInsights;
