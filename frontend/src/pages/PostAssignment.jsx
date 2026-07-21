import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function PostAssignment() {
  const [form, setForm] = useState({
    title: "",
    subject: "",
    batch_id: "",
    due_date: "",
    description: "",
  });
  const [file, setFile] = useState(null);
  const [batches, setBatches] = useState([]);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/assignments/batches", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((r) => r.json())
      .then((d) => setBatches(d.batches || []));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    setError("");

    try {
      const token = localStorage.getItem("token");

      // Use FormData to send both text fields and file together
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("subject", form.subject);
      formData.append("batch_id", form.batch_id);
      formData.append("due_date", form.due_date);
      formData.append("description", form.description);
      if (file) formData.append("file", file);

      const res = await fetch("http://localhost:5000/api/assignments", {
        method: "POST",
        headers: { Authorization: "Bearer " + token },
        body: formData,
        // Do NOT set Content-Type header — browser sets it automatically for FormData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setStatus("✅ Assignment posted! Students will be notified by email.");
      setForm({
        title: "",
        subject: "",
        batch_id: "",
        due_date: "",
        description: "",
      });
      setFile(null);
      document.getElementById("fileInput").value = "";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "15px",
    background: "white",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "6px",
    fontSize: "14px",
    fontWeight: 500,
  };

  return (
    <div>
      <Navbar />
      <div
        style={{ maxWidth: "600px", margin: "2rem auto", padding: "0 1rem" }}
      >
        <button
          onClick={() => navigate("/faculty")}
          style={{
            background: "none",
            border: "none",
            color: "#2563eb",
            cursor: "pointer",
            marginBottom: "1rem",
            fontSize: "14px",
          }}
        >
          ← Back to Dashboard
        </button>

        <div
          style={{
            background: "white",
            padding: "2rem",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ marginBottom: "1.5rem" }}>Post New Assignment</h2>

          {status && (
            <div
              style={{
                background: "#dcfce7",
                color: "#16a34a",
                padding: "10px 14px",
                borderRadius: "8px",
                marginBottom: "1rem",
                fontSize: "14px",
              }}
            >
              {status}
            </div>
          )}

          {error && (
            <div
              style={{
                background: "#fee2e2",
                color: "#dc2626",
                padding: "10px 14px",
                borderRadius: "8px",
                marginBottom: "1rem",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>Assignment Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                placeholder="e.g. Binary Search Tree Implementation"
                style={inputStyle}
              />
            </div>

            {/* Subject */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>Subject</label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
                placeholder="e.g. Data Structures"
                style={inputStyle}
              />
            </div>

            {/* Batch Dropdown */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>Select Batch</label>
              <select
                value={form.batch_id}
                onChange={(e) => setForm({ ...form, batch_id: e.target.value })}
                required
                style={inputStyle}
              >
                <option value="">-- Select a batch --</option>
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.department} · {b.name} · Year {b.year}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>Due Date & Time</label>
              <input
                type="datetime-local"
                value={form.due_date}
                onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                required
                style={inputStyle}
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>Description (optional)</label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={4}
                placeholder="Assignment details, submission format, references..."
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>

            {/* File Upload */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyle}>Attach File (optional)</label>
              <div
                style={{
                  border: "2px dashed #ddd",
                  borderRadius: "8px",
                  padding: "20px",
                  textAlign: "center",
                  background: "#fafafa",
                  cursor: "pointer",
                }}
                onClick={() => document.getElementById("fileInput").click()}
              >
                {file ? (
                  <div>
                    <p style={{ color: "#16a34a", fontWeight: 500, margin: 0 }}>
                      📎 {file.name}
                    </p>
                    <p
                      style={{
                        color: "#888",
                        fontSize: "12px",
                        margin: "4px 0 0",
                      }}
                    >
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div>
                    <p style={{ color: "#888", margin: 0, fontSize: "14px" }}>
                      📁 Click to upload a file
                    </p>
                    <p
                      style={{
                        color: "#aaa",
                        fontSize: "12px",
                        margin: "4px 0 0",
                      }}
                    >
                      PDF, DOC, PPT, XLS, Images, ZIP — max 10MB
                    </p>
                  </div>
                )}
              </div>
              <input
                id="fileInput"
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.png,.jpg,.jpeg,.zip"
                onChange={(e) => setFile(e.target.files[0])}
                style={{ display: "none" }}
              />
              {file && (
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    document.getElementById("fileInput").value = "";
                  }}
                  style={{
                    marginTop: "6px",
                    background: "none",
                    border: "none",
                    color: "#dc2626",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                >
                  ✕ Remove file
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                background: loading ? "#93c5fd" : "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "15px",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Posting..." : "Post Assignment"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
