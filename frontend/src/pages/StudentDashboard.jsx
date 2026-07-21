import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function StudentDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/assignments/upcoming", {
      headers: { Authorization: "Bearer " + token },
    })
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        setAssignments(data.assignments || []);
      })
      .catch(function () {
        setAssignments([]);
      })
      .finally(function () {
        setLoading(false);
      });
  }, []);

  function getDaysLeft(due_date) {
    const diff = new Date(due_date) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  function getBadgeColor(days) {
    if (days <= 1) return "#dc2626";
    if (days <= 2) return "#d97706";
    return "#16a34a";
  }

  function getBadgeBg(days) {
    if (days <= 1) return "#fee2e2";
    if (days <= 2) return "#fef3c7";
    return "#dcfce7";
  }

  function getBadgeLabel(days) {
    if (days <= 1) return "Due Today";
    return days + " days left";
  }

  function AssignmentCard(props) {
    const a = props.assignment;
    const days = getDaysLeft(a.due_date);
    const color = getBadgeColor(days);
    const bg = getBadgeBg(days);
    const label = getBadgeLabel(days);
    const dueDate = new Date(a.due_date).toLocaleString();
    const batch = a.batch ? a.batch.department + " - " + a.batch.name : "";
    const fileUrl = "http://localhost:5000/uploads/" + a.file_name;
    const hasFile = a.file_original ? true : false;
    const origName = a.file_original ? a.file_original : "";

    return (
      <div
        style={{
          background: "white",
          padding: "1.25rem 1.5rem",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          borderLeft: "4px solid " + color,
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
            <h3 style={{ fontSize: "16px", marginBottom: "4px" }}>{a.title}</h3>
            <p style={{ color: "#666", fontSize: "13px" }}>{a.subject}</p>
            <p style={{ color: "#888", fontSize: "12px", marginTop: "2px" }}>
              {batch}
            </p>
          </div>
          <span
            style={{
              background: bg,
              color: color,
              padding: "4px 10px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </span>
        </div>

        <p
          style={{
            color: "#555",
            fontSize: "14px",
            marginTop: "10px",
            lineHeight: 1.5,
          }}
        >
          {a.description}
        </p>

        <p
          style={{
            color: "#666",
            fontSize: "13px",
            marginTop: "10px",
            fontWeight: 500,
          }}
        >
          Due: {dueDate}
        </p>

        <div style={{ marginTop: "10px" }}>
          {hasFile ? (
            <button
              onClick={function () {
                window.open(fileUrl, "_blank");
              }}
              style={{
                display: "inline-block",
                background: "#eff6ff",
                color: "#2563eb",
                padding: "6px 14px",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: 500,
                border: "1px solid #bfdbfe",
                cursor: "pointer",
              }}
            >
              Download: {origName}
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div
        style={{ maxWidth: "800px", margin: "2rem auto", padding: "0 1rem" }}
      >
        <div style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "22px" }}>TaskPulse - My Deadlines</h2>
          <p style={{ color: "#666", fontSize: "14px", marginTop: "4px" }}>
            Welcome, {auth.user ? auth.user.name : ""} - assignments due in the
            next 7 days
          </p>
        </div>

        {loading && <p style={{ color: "#666" }}>Loading deadlines...</p>}

        {!loading && assignments.length === 0 && (
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
              No upcoming deadlines in the next 7 days.
            </p>
            <p style={{ color: "#999", fontSize: "14px", marginTop: "4px" }}>
              You are all caught up.
            </p>
          </div>
        )}

        {!loading && assignments.length > 0 && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {assignments.map(function (a) {
              return <AssignmentCard key={a.id} assignment={a} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
