import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

export default function FacultyDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  function fetchAssignments() {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/assignments/all", {
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
  }

  useEffect(function () {
    fetchAssignments();
  }, []);

  function handleDelete(id) {
    if (!window.confirm("Delete this assignment?")) return;
    setDeleting(id);
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/assignments/" + id, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    })
      .then(function (r) {
        return r.json();
      })
      .then(function () {
        setAssignments(
          assignments.filter(function (a) {
            return a.id !== id;
          }),
        );
      })
      .finally(function () {
        setDeleting(null);
      });
  }

  function isExpired(due_date) {
    return new Date(due_date) < new Date();
  }

  function getDaysLeft(due_date) {
    const diff = new Date(due_date) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  const active = assignments.filter(function (a) {
    return !isExpired(a.due_date);
  });
  const expired = assignments.filter(function (a) {
    return isExpired(a.due_date);
  });
  const urgent = active.filter(function (a) {
    return getDaysLeft(a.due_date) <= 2;
  }).length;

  function StatCard(props) {
    return (
      <div
        style={{
          background: "var(--card)",
          borderRadius: "12px",
          padding: "1.25rem",
          flex: 1,
          borderTop: "4px solid " + props.color,
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        <p
          style={{
            fontSize: "28px",
            fontWeight: 700,
            color: props.color,
            margin: 0,
          }}
        >
          {props.value}
        </p>
        <p
          style={{
            fontSize: "13px",
            color: "var(--text-muted)",
            margin: "4px 0 0",
          }}
        >
          {props.label}
        </p>
      </div>
    );
  }

  function AssignmentCard(props) {
    const a = props.assignment;
    const exp = props.expired;
    const batch = a.batch
      ? a.batch.department + " - " + a.batch.name
      : "Batch " + a.batch_id;

    return (
      <div
        style={{
          background: "var(--card)",
          borderRadius: "12px",
          padding: "1.25rem 1.5rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          borderLeft: "4px solid " + (exp ? "#cbd5e1" : "#2563eb"),
          opacity: exp ? 0.7 : 1,
          transition: "transform 0.2s",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "1rem",
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "4px",
              }}
            >
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "var(--text)",
                }}
              >
                {a.title}
              </h3>
              {exp && (
                <span
                  style={{
                    background: "#f1f5f9",
                    color: "#94a3b8",
                    padding: "2px 8px",
                    borderRadius: "20px",
                    fontSize: "11px",
                    fontWeight: 500,
                  }}
                >
                  Expired
                </span>
              )}
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <span
                style={{
                  background: exp ? "#f1f5f9" : "#eff6ff",
                  color: exp ? "#94a3b8" : "#2563eb",
                  padding: "2px 10px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: 500,
                }}
              >
                {a.subject}
              </span>
              <span
                style={{
                  background: "#f8fafc",
                  color: "#64748b",
                  padding: "2px 10px",
                  borderRadius: "20px",
                  fontSize: "12px",
                }}
              >
                {batch}
              </span>
            </div>
          </div>

          <button
            onClick={function () {
              handleDelete(a.id);
            }}
            disabled={deleting === a.id}
            style={{
              background: "#fee2e2",
              color: "#dc2626",
              border: "none",
              padding: "6px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 500,
              cursor: deleting === a.id ? "not-allowed" : "pointer",
              flexShrink: 0,
            }}
          >
            {deleting === a.id ? "..." : "Delete"}
          </button>
        </div>

        {a.description && (
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "14px",
              marginTop: "10px",
              lineHeight: 1.6,
            }}
          >
            {a.description}
          </p>
        )}

        <p
          style={{
            color: exp ? "#94a3b8" : "#dc2626",
            fontSize: "13px",
            marginTop: "10px",
            fontWeight: 500,
          }}
        >
          Due: {new Date(a.due_date).toLocaleString()}
        </p>
      </div>
    );
  }

  return (
    <Layout>
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "var(--text)",
              }}
            >
              Dashboard
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "14px",
                marginTop: "2px",
              }}
            >
              Welcome back, {user ? user.name : ""}
            </p>
          </div>
          <button
            onClick={function () {
              navigate("/faculty/post");
            }}
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            + Post Assignment
          </button>
        </div>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "2rem",
            flexWrap: "wrap",
          }}
        >
          <StatCard
            value={active.length}
            label="Active Assignments"
            color="#2563eb"
          />
          <StatCard value={urgent} label="Urgent (2 days)" color="#d97706" />
          <StatCard
            value={expired.length}
            label="Expired Assignments"
            color="#94a3b8"
          />
        </div>

        {loading ? (
          <p style={{ color: "var(--text-muted)" }}>Loading...</p>
        ) : (
          <div>
            {active.length === 0 && expired.length === 0 ? (
              <div
                style={{
                  background: "var(--card)",
                  padding: "3rem",
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: "48px", marginBottom: "1rem" }}>📭</p>
                <p style={{ color: "var(--text-muted)" }}>
                  No assignments posted yet.
                </p>
              </div>
            ) : (
              <div>
                {active.length > 0 && (
                  <div style={{ marginBottom: "2rem" }}>
                    <h3
                      style={{
                        fontSize: "15px",
                        fontWeight: 600,
                        color: "var(--text)",
                        marginBottom: "1rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "#2563eb",
                          display: "inline-block",
                        }}
                      ></span>
                      Active ({active.length})
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                      }}
                    >
                      {active.map(function (a) {
                        return (
                          <AssignmentCard
                            key={a.id}
                            assignment={a}
                            expired={false}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                {expired.length > 0 && (
                  <div>
                    <h3
                      style={{
                        fontSize: "15px",
                        fontWeight: 600,
                        color: "var(--text-muted)",
                        marginBottom: "1rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "#cbd5e1",
                          display: "inline-block",
                        }}
                      ></span>
                      Expired ({expired.length})
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                      }}
                    >
                      {expired.map(function (a) {
                        return (
                          <AssignmentCard
                            key={a.id}
                            assignment={a}
                            expired={true}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
