import React, { useState } from "react";

const API_BASE = "https://nullspire-api.onrender.com";
const ADMIN_PASSWORD = "ChatGPT123";

function App() {
  const [path] = useState(window.location.pathname);

  if (path === "/admin") {
    return <AdminPage />;
  }

  return <CharacterLookup />;
}

function CharacterLookup() {
  const [query, setQuery] = useState("");
  const [character, setCharacter] = useState(null);
  const [error, setError] = useState(null);
  const [submissionMsg, setSubmissionMsg] = useState("");

  const handleSearch = async () => {
    setError(null);
    setCharacter(null);
    try {
      const res = await fetch(`${API_BASE}/character/${query}`);
      if (!res.ok) throw new Error("Character not found");
      const data = await res.json();
      setCharacter(data);
    } catch {
      setError("Character not found.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionMsg("");
    const name = e.target.name.value;
    const level = e.target.level.value;
    const organization = e.target.organization.value;
    const profession = e.target.profession.value;

    const body = { name, level, organization, profession };

    try {
      const res = await fetch(`${API_BASE}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setSubmissionMsg("Thank you! Your submission is pending approval.");
        e.target.reset();
      } else {
        setSubmissionMsg("Submission failed.");
      }
    } catch {
      setSubmissionMsg("Error submitting character.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "black", color: "white", padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", color: "#3b82f6", textAlign: "center", marginBottom: "2rem" }}>
        NullSpire Character Lookup
      </h1>

      <div style={{ maxWidth: 500, margin: "0 auto", display: "flex", gap: 8 }}>
        <input
          placeholder="Search character by name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1, padding: 8, borderRadius: 4 }}
        />
        <button onClick={handleSearch} style={{ padding: "8px 16px", background: "#3b82f6", color: "white", borderRadius: 4 }}>
          Search
        </button>
      </div>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      {character && (
        <div style={{ background: "#1f2937", padding: 16, borderRadius: 8, marginTop: 16, maxWidth: 500, marginInline: "auto" }}>
          <h2 style={{ fontSize: 20 }}>{character.name}</h2>
          <p><strong>Level:</strong> {character.level}</p>
          <p><strong>Organization:</strong> {character.organization}</p>
          <p><strong>Profession:</strong> {character.profession}</p>
        </div>
      )}

      <div style={{ maxWidth: 500, margin: "3rem auto 0" }}>
        <h2 style={{ fontSize: "1.25rem", marginBottom: 8 }}>Submit a Character</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" required style={inputStyle} />
          <input name="level" placeholder="Level" required style={inputStyle} />
          <input name="organization" placeholder="Organization" required style={inputStyle} />
          <input name="profession" placeholder="Profession" required style={inputStyle} />
          <button type="submit" style={{ ...inputStyle, background: "#22c55e", color: "white" }}>Submit</button>
        </form>
        {submissionMsg && <p style={{ marginTop: 8, color: "#93c5fd" }}>{submissionMsg}</p>}
      </div>

      <footer style={{ marginTop: "3rem", textAlign: "center", color: "#9ca3af", fontSize: "0.875rem" }}>
        <p>This is a fan-made website and is not officially affiliated with NullSpire or its developers.</p>
      </footer>
    </div>
  );
}

function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [pending, setPending] = useState([]);

  const login = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      fetchPending();
    } else {
      alert("Incorrect password");
    }
  };

  const fetchPending = async () => {
    try {
      const res = await fetch(`${API_BASE}/pending`);
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      setPending(data);
    } catch {
      alert("Failed to fetch pending submissions.");
    }
  };

  const approve = async (name) => {
    try {
      await fetch(`${API_BASE}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      fetchPending();
    } catch {
      alert("Failed to approve.");
    }
  };

  const reject = async (name) => {
    try {
      await fetch(`${API_BASE}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      fetchPending();
    } catch {
      alert("Failed to reject.");
    }
  };

  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", background: "black", color: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <h2>Admin Login</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          style={{ padding: 8, borderRadius: 4, margin: 8 }}
        />
        <button onClick={login} style={{ padding: 8, background: "#3b82f6", color: "white", borderRadius: 4 }}>Login</button>
      </div>
    );
  }

  return (
    <div style={{ background: "black", color: "white", minHeight: "100vh", padding: 16 }}>
      <h1 style={{ fontSize: 24, color: "#60a5fa", textAlign: "center" }}>Pending Submissions</h1>
      {pending.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: 32 }}>No pending characters.</p>
      ) : (
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          {pending.map((char, idx) => (
            <div key={idx} style={{ background: "#1f2937", padding: 12, borderRadius: 6, marginBottom: 12 }}>
              <p><strong>Name:</strong> {char.name}</p>
              <p><strong>Level:</strong> {char.level}</p>
              <p><strong>Organization:</strong> {char.organization}</p>
              <p><strong>Profession:</strong> {char.profession}</p>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button onClick={() => approve(char.name)} style={{ background: "#22c55e", padding: 6, borderRadius: 4, color: "white" }}>Approve</button>
                <button onClick={() => reject(char.name)} style={{ background: "#ef4444", padding: 6, borderRadius: 4, color: "white" }}>Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "8px",
  borderRadius: "4px",
  marginBottom: "8px",
  backgroundColor: "#1f2937",
  color: "white",
  border: "1px solid #374151",
};

export default App;
