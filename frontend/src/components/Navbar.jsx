import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        background: "#2563eb",
        color: "white",
        padding: "0 2rem",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <span style={{ fontWeight: 600, fontSize: "18px" }}>⚡ TaskPulse</span>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <span style={{ fontSize: "14px" }}>
          {user?.name} ({user?.role})
        </span>
        <button
          onClick={handleLogout}
          style={{
            background: "white",
            color: "#2563eb",
            border: "none",
            padding: "6px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
