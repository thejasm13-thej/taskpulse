import { useState, useEffect } from "react";
import client from "../api/axiosClient";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function StudentDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    client
      .get("/assignments/upcoming")
      .then((res) => setAssignments(res.data.assignments || []))
      .catch(() => setAssignments([]))
      .finally(() => setLoading(false));
  }, []);

  const getDaysLeft = (due_date) => {
    const diff = new Date(due_date) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getBadge = (days) => {
    if (days <= 1)
      return { label: "Due Today", color: "#dc2626", bg: "#fee2e2" };
    if (days <= 2)
      return { label: `${days} days left`, color: "#d97706", bg: "#fef3c7" };
    return { label: `${days} days left`, color: "#16a34a", bg: "#dcfce7" };
  };

  return (
    <div>
      <Navbar />
      <div
        style={{ maxWidth: "800px", margin: "2rem auto", padding: "0 1rem" }}
      >
        <div style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "22px" }}>Upcoming Deadlines</h2>
          <p style={{ color: "#666", fontSize: "14px", marginTop: "4px" }}>
            Welcome, {user?.name} — next 7 days
          </p>
        </div>

        {loading ? (
          <p style={{ color: "#666" }}>Loading deadlines...</p>
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
            <p style={{ fontSize: "48px", marginBottom: "1rem" }}>🎉</p>
            <p style={{ color: "#666" }}>
              No upcoming deadlines in the next 7 days!
            </p>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {assignments.map((a) => {
              const days = getDaysLeft(a.due_date);
              const badge = getBadge(days);
              return (
                <div
                  key={a.id}
                  style={{
                    background: "white",
                    padding: "1.25rem 1.5rem",
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    borderLeft: `4px solid ${badge.color}`,
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
                      <p
                        style={{
                          color: "#888",
                          fontSize: "12px",
                          marginTop: "2px",
                        }}
                      >
                        {a.batch
                          ? `${a.batch.department} · ${a.batch.name}`
                          : ""}
                      </p>
                    </div>
                    <span
                      style={{
                        background: badge.bg,
                        color: badge.color,
                        padding: "4px 10px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {badge.label}
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
                      color: "#666",
                      fontSize: "13px",
                      marginTop: "10px",
                    }}
                  >
                    📅 Due: {new Date(a.due_date).toLocaleString()}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
