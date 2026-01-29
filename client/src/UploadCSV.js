import { useState } from "react";

function UploadCSV({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const token = localStorage.getItem("token");

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a CSV file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(
        "https://ai-personal-finance-advisor-using-mern-usuh.onrender.com/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

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
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button onClick={handleUpload}>Upload CSV</button>
    </div>
  );
}

export default UploadCSV;
