import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

function TaskTracker() {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch("/api/v1/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

  const addTask = (e) => {
    e.preventDefault();
    if (title.trim() === "") return;
    setAdding(true);
    fetch("/api/v1/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTasks([...tasks, data]);
        setTitle("");
      })
      .finally(() => setAdding(false));
  };

  const deleteTask = (id) => {
    fetch(`/api/v1/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => {
      setTasks(tasks.filter((s) => s.id !== id));
    });
  };

  const toggleTask = (id) => {
    fetch(`/api/v1/tasks/${id}/toggle`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((updatedTask) => {
        setTasks(tasks.map((t) => (t.id === id ? updatedTask : t)));
      });
  };

  const remaining = tasks.filter((t) => !t.completed).length;

  if (loading) {
    return (
      <div style={styles.page}>
        <p style={styles.stateText}>Loading tasks…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.errorBanner}>Couldn&apos;t load tasks: {error}</div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.heading}>Your tasks</h1>
          <p style={styles.subheading}>
            {tasks.length === 0
              ? "Nothing here yet."
              : remaining === 0
                ? "All caught up."
                : `${remaining} task${remaining === 1 ? "" : "s"} remaining`}
          </p>
        </header>

        <form onSubmit={addTask} style={styles.addRow}>
          <input
            style={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a task…"
          />
          <button type="submit" style={styles.addButton} disabled={adding}>
            {adding ? "Adding…" : "Add"}
          </button>
        </form>

        {tasks.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyTitle}>No tasks yet</p>
            <p style={styles.emptyText}>
              Add your first task above to get started.
            </p>
          </div>
        ) : (
          <ul style={styles.list}>
            {tasks.map((t) => (
              <li key={t.id} style={styles.row}>
                <button
                  onClick={() => toggleTask(t.id)}
                  aria-label={t.completed ? "Mark as not done" : "Mark as done"}
                  style={{
                    ...styles.checkbox,
                    ...(t.completed ? styles.checkboxChecked : {}),
                  }}
                >
                  {t.completed && (
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2.5 6.5L5 9L9.5 3"
                        stroke="#FFFFFF"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>

                <span
                  style={{
                    ...styles.taskTitle,
                    ...(t.completed ? styles.taskTitleDone : {}),
                  }}
                >
                  {t.title}
                </span>

                <button
                  onClick={() => deleteTask(t.id)}
                  aria-label="Delete task"
                  style={styles.deleteButton}
                >
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 4h10M6.5 4V2.5h3V4M4.5 4l.5 9h6l.5-9"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background: "#F4F6F5",
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    padding: "56px 24px",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
  },
  container: {
    width: "100%",
    maxWidth: "560px",
  },
  header: {
    marginBottom: "28px",
  },
  heading: {
    margin: "0 0 6px",
    fontSize: "26px",
    fontWeight: 600,
    letterSpacing: "-0.02em",
    color: "#15201D",
  },
  subheading: {
    margin: 0,
    fontSize: "14px",
    color: "#5C6A66",
  },
  addRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "28px",
  },
  input: {
    flex: 1,
    fontSize: "14px",
    padding: "11px 14px",
    borderRadius: "9px",
    border: "1px solid #D4DBD8",
    outline: "none",
    color: "#15201D",
    background: "#FFFFFF",
    boxSizing: "border-box",
  },
  addButton: {
    padding: "11px 20px",
    borderRadius: "9px",
    border: "none",
    background: "#0B3B33",
    color: "#FFFFFF",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  list: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    background: "#FFFFFF",
    borderRadius: "12px",
    border: "1px solid #E3E8E6",
    overflow: "hidden",
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 16px",
    borderBottom: "1px solid #EEF1F0",
  },
  checkbox: {
    width: "20px",
    height: "20px",
    minWidth: "20px",
    borderRadius: "6px",
    border: "1.5px solid #C7D0CC",
    background: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    padding: 0,
    transition: "background 0.15s ease, border-color 0.15s ease",
  },
  checkboxChecked: {
    background: "#0B3B33",
    borderColor: "#0B3B33",
  },
  taskTitle: {
    flex: 1,
    fontSize: "14.5px",
    color: "#1E2B27",
    lineHeight: 1.4,
    wordBreak: "break-word",
  },
  taskTitleDone: {
    color: "#A3ACA8",
    textDecoration: "line-through",
  },
  deleteButton: {
    border: "none",
    background: "transparent",
    color: "#A3ACA8",
    cursor: "pointer",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  emptyState: {
    background: "#FFFFFF",
    border: "1px dashed #D4DBD8",
    borderRadius: "12px",
    padding: "40px 24px",
    textAlign: "center",
  },
  emptyTitle: {
    margin: "0 0 4px",
    fontSize: "15px",
    fontWeight: 600,
    color: "#1E2B27",
  },
  emptyText: {
    margin: 0,
    fontSize: "13.5px",
    color: "#5C6A66",
  },
  stateText: {
    fontSize: "14px",
    color: "#5C6A66",
  },
  errorBanner: {
    background: "#FDECEA",
    border: "1px solid #F3C7C2",
    color: "#8A2E22",
    fontSize: "13.5px",
    borderRadius: "8px",
    padding: "12px 16px",
    maxWidth: "420px",
  },
};

export default TaskTracker;
