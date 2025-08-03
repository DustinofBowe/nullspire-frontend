import React, { useState, useEffect } from "react";

const API_BASE = "https://nullspire-api.onrender.com";

function CharacterLookup() {
  const [query, setQuery] = useState("");
  const [character, setCharacter] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    setError(null);
    setCharacter(null);
    if (!query.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/api/characters?name=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Character not found.");
      const data = await res.json();
      setCharacter(data);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-center mb-6 tracking-widest text-blue-400">
        NullSpire Character Lookup
      </h1>
      <div className="max-w-md mx-auto flex gap-2 mb-4">
        <input
          placeholder="Enter character name..."
          className="flex-grow bg-gray-800 border border-blue-600 text-white p-2 rounded"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 rounded"
        >
          Search
        </button>
      </div>
      {error && <p className="text-center text-red-500 mb-4">{error}</p>}
      {character && (
        <div className="bg-gray-800 border border-blue-700 max-w-md mx-auto mb-6 p-4 rounded">
          <h2 className="text-xl font-semibold text-blue-300 mb-2">{character.name}</h2>
          <p><strong>Level:</strong> {character.level}</p>
          <p><strong>Organization:</strong> {character.organization}</p>
        </div>
      )}
    </div>
  );
}

function SubmitCharacter() {
  const [name, setName] = useState("");
  const [level, setLevel] = useState("");
  const [organization, setOrganization] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!name.trim() || !level.trim() || !organization.trim()) {
      setError("All fields are required.");
      return;
    }
    if (isNaN(level) || parseInt(level) <= 0) {
      setError("Level must be a positive number.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/api/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, level: parseInt(level), organization }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed.");
      setMessage("Thank you! Your submission is pending approval.");
      setName("");
      setLevel("");
      setOrganization("");
    } catch (e) {
      setError(e.message);
    }

    setSubmitting(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-gray-900 rounded">
      <h2 className="text-2xl font-semibold text-blue-400 mb-4">Submit a New Character</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          placeholder="Name"
          className="w-full p-2 bg-gray-800 border border-gray-700 text-white rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={submitting}
        />
        <input
          placeholder="Level"
          className="w-full p-2 bg-gray-800 border border-gray-700 text-white rounded"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          disabled={submitting}
        />
        <input
          placeholder="Organization"
          className="w-full p-2 bg-gray-800 border border-gray-700 text-white rounded"
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          disabled={submitting}
        />
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-green-600 hover:bg-green-500 text-white p-2 rounded"
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>
      {message && <p className="mt-3 text-green-400">{message}</p>}
      {error && <p className="mt-3 text-red-500">{error}</p>}
    </div>
  );
}

function AdminPage() {
  const [password, setPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [error, setError] = useState(null);

  const API_ADMIN_HEADER = { "x-admin-password": password };

  const fetchPending = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/pending`, {
        headers: API_ADMIN_HEADER,
      });
      if (res.status === 401) {
        setError("Unauthorized: Wrong password");
        setAuthorized(false);
        setPending([]);
      } else if (!res.ok) {
        throw new Error("Failed to load pending submissions.");
      } else {
        const data = await res.json();
        setPending(data);
        setAuthorized(true);
      }
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    fetchPending();
  };

  const handleAction = async (id, approve) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/pending/${approve ? "approve" : "reject"}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...API_ADMIN_HEADER,
        },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Action failed");
      }
      await fetchPending();
    } catch (e) {
      setError(e.message);
    }
    setActionLoading((prev) => ({ ...prev, [id]: false }));
  };

  if (!authorized) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 bg-gray-900 rounded text-white">
        <h2 className="text-xl mb-4">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="password"
            placeholder="Enter admin password"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 p-2 rounded text-white"
          >
            Log In
          </button>
        </form>
        {error && <p className="mt-3 text-red-500">{error}</p>}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-gray-900 rounded text-white">
      <h2 className="text-2xl mb-6">Pending Character Submissions</h2>
      {loading ? (
        <p>Loading...</p>
      ) : pending.length === 0 ? (
        <p>No pending submissions.</p>
      ) : (
        <table className="w-full text-left border-collapse border border-gray-700">
          <thead>
            <tr>
              <th className="border border-gray-700 p-2">Name</th>
              <th className="border border-gray-700 p-2">Level</th>
              <th className="border border-gray-700 p-2">Organization</th>
              <th className="border border-gray-700 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pending.map(({ id, name, level, organization }) => (
              <tr key={id} className="border border-gray-700">
                <td className="border border-gray-700 p-2">{name}</td>
                <td className="border border-gray-700 p-2">{level}</td>
                <td className="border border-gray-700 p-2">{organization}</td>
                <td className="border border-gray-700 p-2 space-x-2">
                  <button
                    disabled={actionLoading[id]}
                    onClick={() => handleAction(id, true)}
                    className="bg-green-600 hover:bg-green-500 px-2 py-1 rounded"
                  >
                    {actionLoading[id] ? "..." : "Approve"}
                  </button>
                  <button
                    disabled={actionLoading[id]}
                    onClick={() => handleAction(id, false)}
                    className="bg-red-600 hover:bg-red-500 px-2 py-1 rounded"
                  >
                    {actionLoading[id] ? "..." : "Reject"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {error && <p className="mt-3 text-red-500">{error}</p>}
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("lookup");

  useEffect(() => {
    const path = window.location.pathname.toLowerCase();
    if (path === "/admin") setPage("admin");
    else setPage("lookup");
  }, []);

  if (page === "admin") return <AdminPage />;
  return (
    <>
      <CharacterLookup />
      <SubmitCharacter />
    </>
  );
}
