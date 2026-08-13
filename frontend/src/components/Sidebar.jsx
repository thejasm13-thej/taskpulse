import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { dark, toggleDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function NavItem(props) {
    const active = location.pathname === props.path;
    return (
      <button
        onClick={function () {
          navigate(props.path);
        }}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "10px 16px",
          borderRadius: "8px",
          border: "none",
          background: active ? "rgba(255,255,255,0.15)" : "transparent",
          color: "white",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: active ? 600 : 400,
          textAlign: "left",
          marginBottom: "4px",
          transition: "background 0.2s",
        }}
      >
        <span style={{ fontSize: "18px" }}>{props.icon}</span>
        {props.label}
      </button>
    );
  }

  return (
    <div
      style={{
        width: "240px",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #1e40af 0%, #1e3a8a 100%)",
        display: "flex",
        flexDirection: "column",
        padding: "1.5rem 1rem",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
      }}
    >
      <div style={{ marginBottom: "2rem", padding: "0 8px" }}>
        <h1
          style={{
            color: "white",
            fontSize: "22px",
            fontWeight: 700,
            letterSpacing: "-0.5px",
          }}
        >
          TaskPulse
        </h1>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px" }}>
          Assignment Reminder
        </p>
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.1)",
          borderRadius: "10px",
          padding: "12px",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: 700,
            fontSize: "14px",
            flexShrink: 0,
          }}
        >
          {user ? user.name.charAt(0).toUpperCase() : "U"}
        </div>
        <div style={{ overflow: "hidden" }}>
          <p
            style={{
              color: "white",
              fontSize: "13px",
              fontWeight: 600,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {user ? user.name : ""}
          </p>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "11px",
              textTransform: "capitalize",
            }}
          >
            {user ? user.role : ""}
          </p>
        </div>
      </div>

      <nav style={{ flex: 1 }}>
        {user && user.role === "faculty" && (
          <div>
            <p
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: "11px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "1px",
                padding: "0 8px",
                marginBottom: "8px",
              }}
            >
              Faculty
            </p>
            <NavItem path="/faculty" icon="📊" label="Dashboard" />
            <NavItem path="/faculty/post" icon="✏️" label="Post Assignment" />
          </div>
        )}

        {user && user.role === "student" && (
          <div>
            <p
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: "11px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "1px",
                padding: "0 8px",
                marginBottom: "8px",
              }}
            >
              Student
            </p>
            <NavItem path="/student" icon="📚" label="My Assignments" />
          </div>
        )}
      </nav>

      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.1)",
          paddingTop: "1rem",
        }}
      >
        <button
          onClick={toggleDark}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "10px 16px",
            borderRadius: "8px",
            border: "none",
            background: "transparent",
            color: "white",
            cursor: "pointer",
            fontSize: "14px",
            marginBottom: "4px",
          }}
        >
          <span style={{ fontSize: "18px" }}>{dark ? "☀️" : "🌙"}</span>
          {dark ? "Light Mode" : "Dark Mode"}
        </button>

        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "10px 16px",
            borderRadius: "8px",
            border: "none",
            background: "rgba(255,255,255,0.1)",
            color: "white",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          <span style={{ fontSize: "18px" }}>🚪</span>
          Logout
        </button>
      </div>
    </div>
  );
}
