import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
function TaskTracker() {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetch("/api/v1/tasks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
  const addTask = () => {
    if (title === "") return;
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
      });
  };

  const deleteTask = (id) => {
    fetch(`/api/v1/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(() => {
      setTasks(tasks.filter((s) => s.id !== id));
    });
  };

  const toggleTask = (id) => {
    fetch(`/api/v1/tasks/${id}/toggle`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((updatedTask) => {
        setTasks(tasks.map((t) => (t.id === id ? updatedTask : t)));
      });
  };
  if (loading) return <p>Tasks loading....</p>;
  if (error) return <p style={{ color: "red" }}>Error:{error}</p>;
  return (
    <div>
      <h2>Task Tracker Dashboard</h2>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter title"
      />
      <button onClick={addTask}>Add Task</button>
      <ul>
        {tasks.map((s) => (
          <li key={s.id}>
            {s.title} — Status:{" "}
            {s.completed ? <span>✅</span> : <span>⬜</span>}
            <button onClick={() => toggleTask(s.id)}>Change status</button>
            <button onClick={() => deleteTask(s.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default TaskTracker;
