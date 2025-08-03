// AdminPage.js
import { useState, useEffect } from "react";

const API_BASE = "https://nullspire-api.onrender.com";
const ADMIN_PASSWORD = "ChatGPT123";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [pending, setPending] = useState([]);
  const [error, setError] = useState(null);

  const fetchPending = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/pending`, {
        headers: { "x-admin-password": ADMIN_PASSWORD },
      });
      if (!res.ok) throw new Error("Unauthorized or error fetching data.");
      const data = await res.json();
      setPending(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleApprove = async (id) => {
    await fetch(`${API_BASE}/api/pending/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": ADMIN_PASSWORD,
      },
      body: JSON.stringify({ id }),
    });
    fetchPending();
  };

  const handleReject = async (id) => {
    await fetch(`${API_BASE}/api/pending/reject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": ADMIN_PASSWORD,
      },
      body: JSON.stringify({ id }),
    });
    fetchPending();
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      fetchPending();
    } else {
      setError("Incorrect password");
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h2 className="text-2xl mb-4">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-2">
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-800 border border-gray-600 p-2 text-white"
          />
          <button className="bg-blue-600 hover:bg-blue-500 p-2 rounded w-full">Login</button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl text-blue-400 mb-6">Pending Character Approvals</h1>
      {pending.length === 0 ? (
        <p>No pending characters.</p>
      ) : (
        <ul className="space-y-4">
          {pending.map((char) => (
            <li key={char.id} className="bg-gray-800 p-4 rounded border border-blue-600">
              <p><strong>Name:</strong> {char.name}</p>
              <p><strong>Level:</strong> {char.level}</p>
              <p><strong>Organization:</strong> {char.organization}</p>
              <p><strong>Profession:</strong> {char.profession}</p>
              <div className="mt-2 flex gap-2">
                <button onClick={() => handleApprove(char.id)} className="bg-green-600 hover:bg-green-500 px-4 py-1 rounded">Approve</button>
                <button onClick={() => handleReject(char.id)} className="bg-red-600 hover:bg-red-500 px-4 py-1 rounded">Reject</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
