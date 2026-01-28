import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function CategoryChart({ data }) {
  if (!data || data.length === 0) return null;

  const chartData = {
    labels: data.map(d => d._id),
    datasets: [
      {
        data: data.map(d => Math.abs(d.total)), // 🔥 FIX
        backgroundColor: [
          "#36A2EB",
          "#FF6384",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40"
        ]
      }
    ]
  };

  return (
    <div style={{ width: "400px", marginBottom: "20px" }}>
      <h3>Category Breakdown</h3>
      <Pie data={chartData} />
    </div>
  );
}

export default CategoryChart;
