import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !password || !confirmPassword) {
      setError("Fill in every field to continue.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error("That username is already taken.");

      const data = await res.json();
      login({ username }, data.token);
      navigate("/tasks");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.brandRow}>
          <div style={styles.logoMark} aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M3.5 9.5L7 13L14.5 4.5"
                stroke="#0B3B33"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span style={styles.brandName}>Task Tracker</span>
        </div>

        <h1 style={styles.heading}>Create your account</h1>
        <p style={styles.subheading}>
          Start tracking your tasks in under a minute.
        </p>

        {error && (
          <div role="alert" style={styles.errorBanner}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} style={styles.form} noValidate>
          <label style={styles.label} htmlFor="username">
            Username
          </label>
          <input
            id="username"
            style={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="yourname"
            autoComplete="username"
          />

          <label style={styles.label} htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
          />

          <label style={styles.label} htmlFor="confirmPassword">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            style={styles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
          />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p style={styles.footerText}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#F4F6F5",
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    padding: "24px",
    boxSizing: "border-box",
  },
  card: {
    width: "100%",
    maxWidth: "380px",
    background: "#FFFFFF",
    borderRadius: "14px",
    border: "1px solid #E3E8E6",
    boxShadow:
      "0 1px 2px rgba(15, 23, 21, 0.04), 0 8px 24px rgba(15, 23, 21, 0.05)",
    padding: "36px 32px 32px",
    boxSizing: "border-box",
  },
  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "28px",
  },
  logoMark: {
    width: "28px",
    height: "28px",
    borderRadius: "8px",
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
  heading: {
    margin: "0 0 6px",
    fontSize: "22px",
    fontWeight: 600,
    letterSpacing: "-0.015em",
    color: "#15201D",
  },
  subheading: {
    margin: "0 0 24px",
    fontSize: "14px",
    color: "#5C6A66",
    lineHeight: 1.5,
  },
  errorBanner: {
    background: "#FDECEA",
    border: "1px solid #F3C7C2",
    color: "#8A2E22",
    fontSize: "13px",
    lineHeight: 1.4,
    borderRadius: "8px",
    padding: "10px 12px",
    marginBottom: "18px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "12.5px",
    fontWeight: 600,
    color: "#3D4A46",
    marginBottom: "6px",
    marginTop: "16px",
  },
  input: {
    fontSize: "14px",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #D4DBD8",
    outline: "none",
    color: "#15201D",
    background: "#FBFCFC",
    boxSizing: "border-box",
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
  },
  button: {
    marginTop: "26px",
    padding: "11px 16px",
    borderRadius: "8px",
    border: "none",
    background: "#0B3B33",
    color: "#FFFFFF",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.15s ease, opacity 0.15s ease",
  },
  footerText: {
    marginTop: "24px",
    marginBottom: 0,
    fontSize: "13px",
    color: "#5C6A66",
    textAlign: "center",
  },
  link: {
    color: "#0B3B33",
    fontWeight: 600,
    textDecoration: "none",
  },
};

export default RegisterPage;
