import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initial = user?.username ? user.username.charAt(0).toUpperCase() : "";

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <Link to={user ? "/tasks" : "/login"} style={styles.brandRow}>
          <div style={styles.logoMark} aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
              <path
                d="M3.5 9.5L7 13L14.5 4.5"
                stroke="#0B3B33"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span style={styles.brandName}>Task Tracker</span>
        </Link>

        {user ? (
          <div style={styles.userRow}>
            <div style={styles.avatar}>{initial}</div>
            <span style={styles.username}>{user.username}</span>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Log out
            </button>
          </div>
        ) : (
          <Link to="/login" style={styles.loginLink}>
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    width: "100%",
    background: "#FFFFFF",
    borderBottom: "1px solid #E3E8E6",
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  inner: {
    maxWidth: "720px",
    margin: "0 auto",
    padding: "14px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxSizing: "border-box",
  },
  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    textDecoration: "none",
  },
  logoMark: {
    width: "26px",
    height: "26px",
    borderRadius: "7px",
    background: "#D6EDE6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  brandName: {
    fontSize: "14px",
    fontWeight: 600,
    letterSpacing: "-0.01em",
    color: "#1E2B27",
  },
  userRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  avatar: {
    width: "26px",
    height: "26px",
    borderRadius: "50%",
    background: "#0B3B33",
    color: "#FFFFFF",
    fontSize: "12px",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  username: {
    fontSize: "13.5px",
    color: "#3D4A46",
    fontWeight: 500,
  },
  logoutButton: {
    marginLeft: "4px",
    padding: "7px 14px",
    borderRadius: "7px",
    border: "1px solid #D4DBD8",
    background: "#FFFFFF",
    color: "#3D4A46",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
  },
  loginLink: {
    fontSize: "13.5px",
    fontWeight: 600,
    color: "#0B3B33",
    textDecoration: "none",
  },
};

export default Navbar;
