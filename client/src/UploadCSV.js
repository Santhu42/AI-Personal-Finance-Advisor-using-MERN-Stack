import { useState } from "react";

const API = "http://localhost:5000";

function UploadCSV({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const token = localStorage.getItem("token");

  const handleUpload = async () => {
    console.log("🔘 Upload button clicked");
    console.log("📄 Selected file:", file);
    console.log("🔑 Token exists:", !!token);

    if (!file) {
      alert("Please select a CSV file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file); // MUST be 'file'

    try {
      console.log("🚀 Sending request to backend");

      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      console.log("📡 Response status:", res.status);

      const data = await res.json();
      console.log("📨 Response data:", data);

      if (!res.ok) {
        throw new Error(data.message);
      }

      alert(data.message || "CSV uploaded successfully");

      if (onUploadSuccess) onUploadSuccess();

    } catch (err) {
      console.error("❌ Upload error:", err);
      alert("Upload failed");
    }
  };

  return (
    <div style={{ border: "1px solid #999", padding: "10px", marginBottom: "20px" }}>
      <h3>Upload Bank Statement (CSV)</h3>

      <input
        type="file"
        accept=".csv"
        onChange={(e) => {
          console.log("📁 File chosen:", e.target.files[0]);
          setFile(e.target.files[0]);
        }}
      />

      <br /><br />

      <button onClick={handleUpload}>Upload CSV</button>
    </div>
  );
}

export default UploadCSV;
