import { useEffect, useState, useCallback } from "react";
import UploadCSV from "./UploadCSV";
import CategoryChart from "./CategoryChart";
import AIInsights from "./AIInsights";

// ✅ Use deployed backend (NOT localhost)
const API = "https://ai-personal-finance-advisor-using-mern-stack.onrender.com";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    balance: 0,
  });

  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  // ===============================
  // HANDLE JWT EXPIRY
  // ===============================
  const handleAuthError = useCallback((res) => {
    if (res.status === 401 || res.status === 403) {
      alert("Session expired. Please login again.");
      localStorage.removeItem("token");
      window.location.reload();
      return true;
    }
    return false;
  }, []);

  // ===============================
  // FETCH TRANSACTIONS
  // ===============================
  const fetchTransactions = useCallback(async () => {
    try {
      const res = await fetch(`${API}/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (handleAuthError(res)) return;

      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error("Fetch transactions failed", err);
    }
  }, [token, handleAuthError]);

  // ===============================
  // FETCH SUMMARY
  // ===============================
  const fetchSummary = useCallback(async () => {
    try {
      const res = await fetch(`${API}/transactions/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (handleAuthError(res)) return;

      const data = await res.json();
      setSummary(data);
    } catch (err) {
      console.error("Fetch summary failed", err);
    }
  }, [token, handleAuthError]);

  // ===============================
  // FETCH CATEGORY ANALYTICS
  // ===============================
  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(`${API}/transactions/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (handleAuthError(res)) return;

      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Fetch categories failed", err);
    }
  }, [token, handleAuthError]);

  // ===============================
  // REFRESH ALL DATA (STABLE)
  // ===============================
  const refreshAll = useCallback(() => {
    fetchTransactions();
    fetchSummary();
    fetchCategories();
  }, [fetchTransactions, fetchSummary, fetchCategories]);

  // ===============================
  // LOAD DATA ON PAGE LOAD
  // ===============================
  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // ===============================
  // ADD TRANSACTION
  // ===============================
  const addTransaction = async () => {
    if (!description || !amount || !category) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description,
          amount: Number(amount),
          category,
        }),
      });

      if (handleAuthError(res)) return;

      setDescription("");
      setAmount("");
      setCategory("");

      refreshAll();
    } catch (err) {
      console.error("Add transaction failed", err);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // DELETE TRANSACTION
  // ===============================
  const deleteTransaction = async (id) => {
    try {
      const res = await fetch(`${API}/transactions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (handleAuthError(res)) return;

      refreshAll();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div>
      <h2>Transactions</h2>

      {/* SUMMARY */}
      <div style={{ padding: "10px", border: "1px solid #ccc", marginBottom: "20px" }}>
        <h3>Summary</h3>
        <p>Income: ₹{summary.income}</p>
        <p>Expense: ₹{summary.expense}</p>
        <p><b>Balance: ₹{summary.balance}</b></p>
      </div>

      {/* CATEGORY CHART */}
      <CategoryChart data={categories} />

      {/* AI INSIGHTS */}
      <AIInsights transactions={transactions} summary={summary} />

      {/* CSV UPLOAD */}
      <UploadCSV onUploadSuccess={refreshAll} />

      {/* ADD TRANSACTION */}
      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          placeholder="Amount (use - for expense)"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <button onClick={addTransaction} disabled={loading}>
          {loading ? "Adding..." : "Add"}
        </button>
      </div>

      {/* TRANSACTION LIST */}
      <ul>
        {transactions.map((t) => (
          <li key={t._id}>
            {t.description} | ₹{t.amount} | {t.category}
            <button
              style={{ marginLeft: "10px" }}
              onClick={() => deleteTransaction(t._id)}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Transactions;
