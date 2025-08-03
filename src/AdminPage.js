import { useState, useEffect } from "react";

const ADMIN_PASSWORD = "ChatGPT123";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [pending, setPending] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const fetchPending = async () => {
    setError(null);
    try {
      const response = await fetch("https://nullspire-api.onrender.com/api/pending", {
        headers: { "x-admin-password": password },
      });
      if (!response.ok) {
        throw new Error("Unauthorized or error fetching pending.");
      }
      const data = await response.json();
      setPending(data);
      setAuthorized(true);
    } catch (e) {
      setError(e.message);
      setAuthorized(false);
      setPending([]);
    }
  };

  useEffect(() => {
    if (authorized) {
      fetchPending();
    }
  }, [authorized]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthorized(true);
      setError(null);
      fetchPending();
    } else {
      setError("Incorrect password.");
      setAuthorized(false);
    }
  };

  const approve = async (id) => {
    setMessage("");
    try {
      const res = await fetch("https://nullspire-api.onrender.com/api/pending/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        fetchPending();
      } else {
        setMessage(data.error || "Approval failed.");
      }
    } catch {
      setMessage("Approval failed.");
    }
  };

  const reject = async (id) => {
    setMessage("");
    try {
      const res = await fetch("https://nullspire-api.onrender.com/api/pending/reject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        fetchPending();
      } else {
        setMessage(data.error || "Rejection failed.");
      }
    } catch {
      setMessage("Rejection failed.");
    }
  };

  if (!authorized) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 max-w-md mx-auto flex flex-col justify-center">
        <h1 className="text-3xl font-bold mb-4 text-center text-blue-400">Admin Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            placeholder="Enter admin password"
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded">
            Login
          </button>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center text-blue-400">Pending Character Approvals</h1>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      {message && <p className="text-green-500 mb-4 text-center">{message}</p>}
      {pending.length === 0 ? (
        <p className="text-center">No pending submissions.</p>
      ) : (
        <ul>
          {pending.map((char) => (
            <li
              key={char.id}
              className="bg-gray-800 border border-blue-700 p-4 rounded mb-3 flex flex-col gap-1"
            >
              <div><strong>Name:</strong> {char.name}</div>
              <div><strong>Level:</strong> {char.level}</div>
              <div><strong>Organization:</strong> {char.organization}</div>
              <div><strong>Profession:</strong> {char.profession}</div>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => approve(char.id)}
                  className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => reject(char.id)}
                  className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
