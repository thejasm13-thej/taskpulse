import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function FacultyDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/assignments/all", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        console.log("Fetched:", data);
        setAssignments(data.assignments || []);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Failed to load assignments");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Navbar />
      <div
        style={{ maxWidth: "800px", margin: "2rem auto", padding: "0 1rem" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <div>
            <h2 style={{ fontSize: "22px" }}>⚡ TaskPulse — Faculty</h2>
            <p style={{ color: "#666", fontSize: "14px", marginTop: "4px" }}>
              Welcome, {user?.name}
            </p>
          </div>
          <button
            onClick={() => navigate("/faculty/post")}
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            + Post Assignment
          </button>
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

        {loading ? (
          <p style={{ color: "#666" }}>Loading assignments...</p>
        ) : assignments.length === 0 ? (
          <div
            style={{
              background: "white",
              padding: "3rem",
              borderRadius: "12px",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <p style={{ fontSize: "48px", marginBottom: "1rem" }}>📭</p>
            <p style={{ color: "#666" }}>No assignments posted yet.</p>
            <p style={{ color: "#999", fontSize: "14px", marginTop: "4px" }}>
              Click "Post Assignment" to get started.
            </p>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {assignments.map((a) => (
              <div
                key={a.id}
                style={{
                  background: "white",
                  padding: "1.25rem 1.5rem",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  borderLeft: "4px solid #2563eb",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: "16px", marginBottom: "4px" }}>
                      {a.title}
                    </h3>
                    <p style={{ color: "#666", fontSize: "13px" }}>
                      {a.subject}
                    </p>
                  </div>
                  <span
                    style={{
                      background: "#eff6ff",
                      color: "#2563eb",
                      padding: "4px 10px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {a.batch
                      ? `${a.batch.department} - ${a.batch.name}`
                      : `Batch ${a.batch_id}`}
                  </span>
                </div>

                {a.description && (
                  <p
                    style={{
                      color: "#555",
                      fontSize: "14px",
                      marginTop: "8px",
                      lineHeight: 1.5,
                    }}
                  >
                    {a.description}
                  </p>
                )}

                <p
                  style={{
                    color: "#dc2626",
                    fontSize: "13px",
                    marginTop: "10px",
                    fontWeight: 500,
                  }}
                >
                  📅 Due: {new Date(a.due_date).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
