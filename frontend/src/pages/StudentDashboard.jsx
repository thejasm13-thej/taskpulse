import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

export default function StudentDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState("All");
  const [sort, setSort] = useState("asc");
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
        const list = data.assignments || [];
        setAssignments(list);
        setFiltered(list);
      })
      .catch(function () {
        setAssignments([]);
      })
      .finally(function () {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let list = assignments.slice();
    if (subject !== "All") {
      list = list.filter(function (a) {
        return a.subject === subject;
      });
    }
    if (sort === "asc") {
      list.sort(function (a, b) {
        return new Date(a.due_date) - new Date(b.due_date);
      });
    } else {
      list.sort(function (a, b) {
        return new Date(b.due_date) - new Date(a.due_date);
      });
    }
    setFiltered(list);
  }, [subject, sort, assignments]);

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

  function getSubjects() {
    const s = assignments.map(function (a) {
      return a.subject;
    });
    return ["All"].concat([...new Set(s)]);
  }

  const dueToday = assignments.filter(function (a) {
    return getDaysLeft(a.due_date) <= 1;
  }).length;
  const urgent = assignments.filter(function (a) {
    return getDaysLeft(a.due_date) <= 2;
  }).length;
  const total = assignments.length;

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
          textAlign: "center",
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
          background: "var(--card)",
          borderRadius: "12px",
          padding: "1.25rem 1.5rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          borderLeft: "4px solid " + color,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "8px",
          }}
        >
          <div style={{ flex: 1 }}>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 600,
                marginBottom: "6px",
                color: "var(--text)",
              }}
            >
              {a.title}
            </h3>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              <span
                style={{
                  background: "#f1f5f9",
                  color: "#475569",
                  padding: "2px 10px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: 500,
                }}
              >
                {a.subject}
              </span>
              {batch && (
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
              )}
            </div>
          </div>
          <span
            style={{
              background: bg,
              color: color,
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 600,
              whiteSpace: "nowrap",
              marginLeft: "8px",
            }}
          >
            {label}
          </span>
        </div>

        {a.description && (
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "14px",
              lineHeight: 1.6,
              marginTop: "8px",
              marginBottom: "10px",
            }}
          >
            {a.description}
          </p>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "12px",
            paddingTop: "12px",
            borderTop: "1px solid var(--border)",
          }}
        >
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "13px",
              margin: 0,
            }}
          >
            Due: {dueDate}
          </p>
          {hasFile ? (
            <button
              onClick={function () {
                window.open(fileUrl, "_blank");
              }}
              style={{
                background: "#eff6ff",
                color: "#2563eb",
                padding: "5px 14px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 500,
                border: "1px solid #bfdbfe",
                cursor: "pointer",
              }}
            >
              Download File
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <h2
            style={{ fontSize: "24px", fontWeight: 700, color: "var(--text)" }}
          >
            My Assignments
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "14px",
              marginTop: "2px",
            }}
          >
            Welcome, {auth.user ? auth.user.name : ""} — all upcoming
            assignments
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "2rem",
            flexWrap: "wrap",
          }}
        >
          <StatCard value={dueToday} label="Due Today" color="#dc2626" />
          <StatCard value={urgent} label="Urgent (2 days)" color="#d97706" />
          <StatCard value={total} label="Total Upcoming" color="#2563eb" />
        </div>

        {loading ? (
          <p style={{ color: "var(--text-muted)" }}>Loading assignments...</p>
        ) : assignments.length === 0 ? (
          <div
            style={{
              background: "var(--card)",
              padding: "3rem",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: "48px", marginBottom: "1rem" }}>🎉</p>
            <p style={{ color: "var(--text-muted)", fontWeight: 500 }}>
              No upcoming assignments.
            </p>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "14px",
                marginTop: "4px",
              }}
            >
              You are all caught up.
            </p>
          </div>
        ) : (
          <div>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                marginBottom: "1rem",
                flexWrap: "wrap",
              }}
            >
              <select
                value={subject}
                onChange={function (e) {
                  setSubject(e.target.value);
                }}
                style={{
                  flex: 1,
                  minWidth: "160px",
                  padding: "8px 12px",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontSize: "14px",
                  background: "var(--card)",
                  color: "var(--text)",
                }}
              >
                {getSubjects().map(function (s) {
                  return (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  );
                })}
              </select>

              <select
                value={sort}
                onChange={function (e) {
                  setSort(e.target.value);
                }}
                style={{
                  flex: 1,
                  minWidth: "160px",
                  padding: "8px 12px",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontSize: "14px",
                  background: "var(--card)",
                  color: "var(--text)",
                }}
              >
                <option value="asc">Earliest First</option>
                <option value="desc">Latest First</option>
              </select>
            </div>

            {filtered.length === 0 ? (
              <div
                style={{
                  background: "var(--card)",
                  padding: "2rem",
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                <p style={{ color: "var(--text-muted)" }}>
                  No assignments found for this subject.
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {filtered.map(function (a) {
                  return <AssignmentCard key={a.id} assignment={a} />;
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
