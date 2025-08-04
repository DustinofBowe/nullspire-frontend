import { useState, useEffect } from "react";

const API_URL = "https://nullspire-api.onrender.com/api";
const ADMIN_PASSWORD = "ChatGPT123";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [pending, setPending] = useState([]);
  const [error, setError] = useState("");

  const fetchPending = async () => {
    setError("");
    const res = await fetch(`${API_URL}/pending`, {
      headers: { "x-admin-password": ADMIN_PASSWORD },
    });
    if (res.ok) setPending(await res.json());
    else setError("Unauthorized or error fetching.");
  };

  const approve = id => fetch(`${API_URL}/pending/approve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-password": ADMIN_PASSWORD
    },
    body: JSON.stringify({ id })
  }).then(fetchPending);

  const reject = id => fetch(`${API_URL}/pending/reject`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-password": ADMIN_PASSWORD
    },
    body: JSON.stringify({ id })
  }).then(fetchPending);

  const handleLogin = e => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      fetchPending();
      setError("");
    } else setError("Incorrect password.");
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h2 className="text-2xl text-blue-400 mb-4">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-2">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="bg-gray-800 text-white p-2 rounded"
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-500 w-full p-2 rounded">Login</button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl text-blue-400 mb-6">Pending Submissions</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {pending.length === 0 ? <p>No pending characters.</p> :
        pending.map(c => (
          <div key={c.id} className="bg-gray-800 border border-blue-600 p-4 mb-4 rounded">
            <p><strong>{c.name}</strong></p>
            <p>Level: {c.level} | Org: {c.organization} | Profession: {c.profession}</p>
            <div className="mt-2 flex gap-2">
              <button onClick={() => approve(c.id)} className="bg-green-600 px-3 py-1 rounded">Approve</button>
              <button onClick={() => reject(c.id)} className="bg-red-600 px-3 py-1 rounded">Reject</button>
            </div>
          </div>
        ))
      }
    </div>
  );
}
