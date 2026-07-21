import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
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
    fetch("taskpulse-production-a975.up.railway.app/uploads/", {
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
    const subjects = assignments.map(function (a) {
      return a.subject;
    });
    return ["All"].concat([...new Set(subjects)]);
  }

  const dueToday = assignments.filter(function (a) {
    return getDaysLeft(a.due_date) <= 1;
  }).length;
  const dueWeek = assignments.length;
  const urgent = assignments.filter(function (a) {
    return getDaysLeft(a.due_date) <= 2;
  }).length;

  function StatCard(props) {
    return (
      <div
        style={{
          background: "white",
          padding: "1.25rem",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          textAlign: "center",
          borderTop: "4px solid " + props.color,
          flex: 1,
        }}
      >
        <p
          style={{
            fontSize: "32px",
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
            color: "#666",
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
    const fileUrl =
      "taskpulse-production-a975.up.railway.app/uploads/" + a.file_name;
    const hasFile = a.file_original ? true : false;
    const origName = a.file_original ? a.file_original : "";

    return (
      <div
        style={{
          background: "white",
          padding: "1.25rem 1.5rem",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
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
                marginBottom: "4px",
                color: "#1e293b",
              }}
            >
              {a.title}
            </h3>
            <div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  background: "#f1f5f9",
                  color: "#475569",
                  padding: "2px 8px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: 500,
                }}
              >
                {a.subject}
              </span>
              <span
                style={{
                  color: "#888",
                  fontSize: "12px",
                }}
              >
                {batch}
              </span>
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
              color: "#555",
              fontSize: "14px",
              lineHeight: 1.6,
              marginBottom: "10px",
              marginTop: "8px",
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
            marginTop: "10px",
            paddingTop: "10px",
            borderTop: "1px solid #f1f5f9",
          }}
        >
          <p
            style={{
              color: "#666",
              fontSize: "13px",
              margin: 0,
              fontWeight: 500,
            }}
          >
            Due: {dueDate}
          </p>

          <div>
            {hasFile ? (
              <button
                onClick={function () {
                  window.open(fileUrl, "_blank");
                }}
                style={{
                  background: "#eff6ff",
                  color: "#2563eb",
                  padding: "5px 12px",
                  borderRadius: "6px",
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
      </div>
    );
  }

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <Navbar />
      <div
        style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1rem" }}
      >
        <div style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "22px", fontWeight: 600, color: "#1e293b" }}>
            My Deadlines
          </h2>
          <p style={{ color: "#666", fontSize: "14px", marginTop: "4px" }}>
            Welcome, {auth.user ? auth.user.name : ""} - assignments due in the
            next 7 days
          </p>
        </div>

        {loading ? (
          <p style={{ color: "#666" }}>Loading deadlines...</p>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                marginBottom: "1.5rem",
                flexWrap: "wrap",
              }}
            >
              <StatCard value={dueToday} label="Due Today" color="#dc2626" />
              <StatCard
                value={urgent}
                label="Urgent (2 days)"
                color="#d97706"
              />
              <StatCard value={dueWeek} label="Due This Week" color="#2563eb" />
            </div>

            {assignments.length === 0 ? (
              <div
                style={{
                  background: "white",
                  padding: "3rem",
                  borderRadius: "12px",
                  textAlign: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                <p style={{ fontSize: "48px", marginBottom: "1rem" }}>🎉</p>
                <p style={{ color: "#666", fontWeight: 500 }}>
                  No upcoming deadlines in the next 7 days.
                </p>
                <p
                  style={{ color: "#999", fontSize: "14px", marginTop: "4px" }}
                >
                  You are all caught up.
                </p>
              </div>
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    marginBottom: "1rem",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <div style={{ flex: 1, minWidth: "160px" }}>
                    <select
                      value={subject}
                      onChange={function (e) {
                        setSubject(e.target.value);
                      }}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        fontSize: "14px",
                        background: "white",
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
                  </div>

                  <div style={{ flex: 1, minWidth: "160px" }}>
                    <select
                      value={sort}
                      onChange={function (e) {
                        setSort(e.target.value);
                      }}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        fontSize: "14px",
                        background: "white",
                      }}
                    >
                      <option value="asc">Due Date - Earliest First</option>
                      <option value="desc">Due Date - Latest First</option>
                    </select>
                  </div>
                </div>

                {filtered.length === 0 ? (
                  <div
                    style={{
                      background: "white",
                      padding: "2rem",
                      borderRadius: "12px",
                      textAlign: "center",
                    }}
                  >
                    <p style={{ color: "#666" }}>
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
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
