import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main
        style={{
          marginLeft: "240px",
          flex: 1,
          minHeight: "100vh",
          background: "var(--bg)",
          padding: "2rem",
        }}
      >
        {children}
      </main>
    </div>
  );
}
