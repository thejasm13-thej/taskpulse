import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/axiosClient";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    batch_id: "",
    faculty_code: "",
  });
  const [batches, setBatches] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    client
      .get("/assignments/batches/public")
      .then((res) => setBatches(res.data.batches || []))
      .catch(() => setBatches([]));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }
    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }
    if (form.role === "student" && !form.batch_id) {
      return setError("Please select your batch");
    }
    if (form.role === "faculty" && !form.faculty_code) {
      return setError("Please enter the faculty code");
    }

    setLoading(true);
    try {
      await client.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        batch_id: form.role === "student" ? form.batch_id : null,
        faculty_code: form.role === "faculty" ? form.faculty_code : null,
      });
      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
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
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "6px",
    fontSize: "14px",
    fontWeight: 500,
    color: "#333",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
        padding: "2rem 1rem",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "2.5rem",
          borderRadius: "12px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "440px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "#2563eb",
              marginBottom: "6px",
            }}
          >
            TaskPulse
          </h1>
          <p style={{ color: "#666", fontSize: "14px", margin: 0 }}>
            Create your account
          </p>
        </div>

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

        {success && (
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
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              placeholder="e.g. Arjun Sharma"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              placeholder="your@email.com"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>I am a</label>
            <select
              value={form.role}
              onChange={(e) =>
                setForm({
                  ...form,
                  role: e.target.value,
                  batch_id: "",
                  faculty_code: "",
                })
              }
              style={inputStyle}
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
            </select>
          </div>

          {form.role === "student" && (
            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>Select Your Batch</label>
              <select
                value={form.batch_id}
                onChange={(e) => setForm({ ...form, batch_id: e.target.value })}
                required
                style={inputStyle}
              >
                <option value="">-- Select your batch --</option>
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.department} - {b.name} - Year {b.year}
                  </option>
                ))}
              </select>
            </div>
          )}

          {form.role === "faculty" && (
            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>Faculty Code</label>
              <input
                type="password"
                value={form.faculty_code}
                onChange={(e) =>
                  setForm({ ...form, faculty_code: e.target.value })
                }
                required
                placeholder="Enter the faculty secret code"
                style={inputStyle}
              />
              <p
                style={{
                  color: "#888",
                  fontSize: "12px",
                  marginTop: "4px",
                  margin: "4px 0 0",
                }}
              >
                Contact your administrator for the faculty code.
              </p>
            </div>
          )}

          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              placeholder="minimum 6 characters"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={labelStyle}>Confirm Password</label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              required
              placeholder="re-enter your password"
              style={inputStyle}
            />
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
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <span style={{ color: "#666", fontSize: "14px" }}>
              Already have an account?{" "}
            </span>
            <button
              type="button"
              onClick={() => navigate("/login")}
              style={{
                background: "none",
                border: "none",
                color: "#2563eb",
                cursor: "pointer",
                fontSize: "14px",
                textDecoration: "underline",
                padding: 0,
              }}
            >
              Login here
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
