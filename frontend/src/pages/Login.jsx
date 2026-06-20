import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import client from "../api/axiosClient";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await client.post("/auth/login", form);
      login(res.data.user, res.data.token);
      if (res.data.user.role === "faculty") {
        navigate("/faculty");
      } else {
        navigate("/student");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotMsg("");
    try {
      const res = await client.post("/auth/forgot-password", {
        email: forgotEmail,
      });
      setForgotMsg(res.data.message);
    } catch (err) {
      setForgotMsg("Something went wrong. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "2.5rem",
          borderRadius: "12px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "#000000",
              marginBottom: "6px",
            }}
          >
            ⚡TaskPulse
          </h1>
          <p style={{ color: "#666", fontSize: "14px", margin: 0 }}>
            Stay ahead of your deadlines.
          </p>
        </div>
        {/* ── FORGOT PASSWORD VIEW ── */}
        {showForgot ? (
          <>
            <h3 style={{ marginBottom: "0.5rem" }}>Reset Password</h3>
            <p
              style={{
                color: "#666",
                fontSize: "13px",
                marginBottom: "1.5rem",
              }}
            >
              Enter your registered email and we will send you a reset link.
            </p>

            {forgotMsg && (
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
                {forgotMsg}
              </div>
            )}

            <form onSubmit={handleForgot}>
              <div style={{ marginBottom: "1rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "15px",
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={forgotLoading}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: forgotLoading ? "#93c5fd" : "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "15px",
                  fontWeight: 600,
                  cursor: forgotLoading ? "not-allowed" : "pointer",
                }}
              >
                {forgotLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <button
                onClick={() => {
                  setShowForgot(false);
                  setForgotMsg("");
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#2563eb",
                  cursor: "pointer",
                  fontSize: "14px",
                  textDecoration: "underline",
                }}
              >
                ← Back to Login
              </button>
            </div>
          </>
        ) : (
          /* ── LOGIN VIEW ── */
          <>
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
              <div style={{ marginBottom: "1rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  placeholder="your@email.com"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "15px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  Password
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                  placeholder="••••••••"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "15px",
                  }}
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
                {loading ? "Logging in..." : "Login"}
              </button>

              <div style={{ textAlign: "center", marginTop: "1rem" }}>
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#2563eb",
                    cursor: "pointer",
                    fontSize: "14px",
                    textDecoration: "underline",
                  }}
                >
                  Forgot password?
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
