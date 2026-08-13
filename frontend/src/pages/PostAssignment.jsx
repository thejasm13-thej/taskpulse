import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

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
      .then(function (r) {
        return r.json();
      })
      .then(function (d) {
        setBatches(d.batches || []);
      })
      .catch(function () {
        setBatches([]);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    setError("");

    try {
      const token = localStorage.getItem("token");
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
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setStatus(
        "Assignment posted successfully! Students will be notified by email.",
      );
      setForm({
        title: "",
        subject: "",
        batch_id: "",
        due_date: "",
        description: "",
      });
      setFile(null);
      const fileInput = document.getElementById("fileInput");
      if (fileInput) fileInput.value = "";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    fontSize: "15px",
    background: "var(--card)",
    color: "var(--text)",
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "6px",
    fontSize: "14px",
    fontWeight: 500,
    color: "var(--text)",
  };

  return (
    <Layout>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <button
            onClick={function () {
              navigate("/faculty");
            }}
            style={{
              background: "none",
              border: "none",
              color: "#2563eb",
              cursor: "pointer",
              fontSize: "14px",
              padding: 0,
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            Back to Dashboard
          </button>
          <h2
            style={{ fontSize: "24px", fontWeight: 700, color: "var(--text)" }}
          >
            Post New Assignment
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "14px",
              marginTop: "2px",
            }}
          >
            Fill in the details below and notify your students instantly.
          </p>
        </div>

        <div
          style={{
            background: "var(--card)",
            borderRadius: "16px",
            padding: "2rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          {status && (
            <div
              style={{
                background: "#dcfce7",
                color: "#16a34a",
                padding: "12px 16px",
                borderRadius: "8px",
                marginBottom: "1.5rem",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Assignment posted successfully! Students will be notified.
            </div>
          )}

          {error && (
            <div
              style={{
                background: "#fee2e2",
                color: "#dc2626",
                padding: "12px 16px",
                borderRadius: "8px",
                marginBottom: "1.5rem",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={labelStyle}>Assignment Title</label>
              <input
                type="text"
                value={form.title}
                onChange={function (e) {
                  setForm({ ...form, title: e.target.value });
                }}
                required
                placeholder="e.g. Binary Search Tree Implementation"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              <label style={labelStyle}>Subject</label>
              <input
                type="text"
                value={form.subject}
                onChange={function (e) {
                  setForm({ ...form, subject: e.target.value });
                }}
                required
                placeholder="e.g. Data Structures"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              <label style={labelStyle}>Select Batch</label>
              <select
                value={form.batch_id}
                onChange={function (e) {
                  setForm({ ...form, batch_id: e.target.value });
                }}
                required
                style={inputStyle}
              >
                <option value="">-- Select a batch --</option>
                {batches.map(function (b) {
                  return (
                    <option key={b.id} value={b.id}>
                      {b.department} - {b.name} - Year {b.year}
                    </option>
                  );
                })}
              </select>
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              <label style={labelStyle}>Due Date and Time</label>
              <input
                type="datetime-local"
                value={form.due_date}
                onChange={function (e) {
                  setForm({ ...form, due_date: e.target.value });
                }}
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              <label style={labelStyle}>Description (optional)</label>
              <textarea
                value={form.description}
                onChange={function (e) {
                  setForm({ ...form, description: e.target.value });
                }}
                rows={4}
                placeholder="Assignment details, submission format, references..."
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyle}>Attach File (optional)</label>
              <div
                onClick={function () {
                  document.getElementById("fileInput").click();
                }}
                style={{
                  border: "2px dashed var(--border)",
                  borderRadius: "10px",
                  padding: "24px",
                  textAlign: "center",
                  cursor: "pointer",
                  background: file ? "#f0fdf4" : "var(--bg)",
                  transition: "all 0.2s",
                }}
              >
                {file ? (
                  <div>
                    <p style={{ color: "#16a34a", fontWeight: 600, margin: 0 }}>
                      {file.name}
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
                    <p style={{ fontSize: "24px", margin: "0 0 8px" }}>📁</p>
                    <p
                      style={{
                        color: "var(--text-muted)",
                        margin: 0,
                        fontSize: "14px",
                      }}
                    >
                      Click to upload a file
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
                onChange={function (e) {
                  setFile(e.target.files[0]);
                }}
                style={{ display: "none" }}
              />
              {file && (
                <button
                  type="button"
                  onClick={function () {
                    setFile(null);
                    document.getElementById("fileInput").value = "";
                  }}
                  style={{
                    marginTop: "8px",
                    background: "none",
                    border: "none",
                    color: "#dc2626",
                    cursor: "pointer",
                    fontSize: "13px",
                    padding: 0,
                  }}
                >
                  Remove file
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "13px",
                background: loading ? "#93c5fd" : "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "15px",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.2s",
              }}
            >
              {loading ? "Posting..." : "Post Assignment"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
