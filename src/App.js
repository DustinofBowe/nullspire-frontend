import { useState, useEffect } from "react";

const API_BASE = "https://nullspire-api.onrender.com/api";
const ADMIN_PASSWORD = "ChatGPT123";

export default function CharacterLookup() {
  const [query, setQuery] = useState("");
  const [character, setCharacter] = useState(null);
  const [error, setError] = useState(null);

  const [pendingList, setPendingList] = useState([]);
  const [pendingError, setPendingError] = useState(null);

  const [submitForm, setSubmitForm] = useState({
    name: "",
    level: "",
    organization: "",
    profession: "",
  });
  const [submitMessage, setSubmitMessage] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  // Search character by name
  const handleSearch = async () => {
    setError(null);
    setCharacter(null);
    if (!query) {
      setError("Please enter a character name.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/characters?name=${encodeURIComponent(query)}`);
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Character not found.");
        return;
      }
      const data = await res.json();
      setCharacter(data);
    } catch {
      setError("Failed to fetch character.");
    }
  };

  // Load pending list (admin)
  const loadPending = async () => {
    setPendingError(null);
    try {
      const res = await fetch(`${API_BASE}/pending`, {
        headers: { "x-admin-password": ADMIN_PASSWORD },
      });
      if (!res.ok) {
        setPendingError("Failed to load pending characters. Check admin password.");
        return;
      }
      const data = await res.json();
      setPendingList(data);
    } catch {
      setPendingError("Network error loading pending characters.");
    }
  };

  // Approve pending character by id
  const approvePending = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/pending/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": ADMIN_PASSWORD,
        },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        alert("Failed to approve character.");
        return;
      }
      alert("Character approved.");
      loadPending();
    } catch {
      alert("Network error approving character.");
    }
  };

  // Reject pending character by id
  const rejectPending = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/pending/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": ADMIN_PASSWORD,
        },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        alert("Failed to reject character.");
        return;
      }
      alert("Character rejected.");
      loadPending();
    } catch {
      alert("Network error rejecting character.");
    }
  };

  // Submit new character
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitMessage(null);

    const { name, level, organization, profession } = submitForm;

    if (!name || !level || !organization) {
      setSubmitError("Please fill in Name, Level, and Organization.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, level: Number(level), organization, profession }),
      });
      if (!res.ok) {
        const data = await res.json();
        setSubmitError(data.error || "Submission failed.");
        return;
      }
      setSubmitMessage("Submission received, pending approval.");
      setSubmitForm({ name: "", level: "", organization: "", profession: "" });
    } catch {
      setSubmitError("Network error during submission.");
    }
  };

  // Load pending on component mount
  useEffect(() => {
    loadPending();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6 font-sans">
      <h1 className="text-4xl font-bold text-center mb-6 tracking-widest text-blue-400">
        NullSpire Character Lookup
      </h1>

      {/* Character Search */}
      <div className="max-w-md mx-auto flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter character name..."
          className="flex-grow bg-gray-800 border border-blue-600 text-white px-3 py-2 rounded"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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
        <div className="bg-gray-800 border border-blue-700 max-w-md mx-auto p-4 rounded mb-6">
          <h2 className="text-xl font-semibold text-blue-300 mb-2">{character.name}</h2>
          <p><strong>Level:</strong> {character.level}</p>
          <p><strong>Organization:</strong> {character.organization}</p>
          <p><strong>Profession:</strong> {character.profession || "N/A"}</p>
        </div>
      )}

      {/* Submit New Character */}
      <div className="max-w-md mx-auto mt-10">
        <h2 className="text-2xl font-semibold text-blue-400 mb-4">Submit a New Character</h2>
        <p className="text-sm text-gray-400 mb-4">Manual submissions only. Automation coming later.</p>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded"
            value={submitForm.name}
            onChange={(e) => setSubmitForm({ ...submitForm, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Level"
            className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded"
            value={submitForm.level}
            onChange={(e) => setSubmitForm({ ...submitForm, level: e.target.value })}
          />
          <input
            type="text"
            placeholder="Organization"
            className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded"
            value={submitForm.organization}
            onChange={(e) => setSubmitForm({ ...submitForm, organization: e.target.value })}
          />
          <input
            type="text"
            placeholder="Profession (optional)"
            className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded"
            value={submitForm.profession}
            onChange={(e) => setSubmitForm({ ...submitForm, profession: e.target.value })}
          />
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
          {submitMessage && <p className="text-green-400 mt-2">{submitMessage}</p>}
          {submitError && <p className="text-red-500 mt-2">{submitError}</p>}
        </form>
      </div>

      {/* Admin Pending List */}
      <div className="max-w-lg mx-auto mt-16">
        <h2 className="text-2xl font-semibold text-blue-400 mb-4">Pending Characters (Admin)</h2>
        {pendingError && <p className="text-red-500 mb-4">{pendingError}</p>}
        {!pendingError && pendingList.length === 0 && (
          <p className="text-gray-400">No pending submissions.</p>
        )}
        {pendingList.map((char) => (
          <div
            key={char.id}
            className="bg-gray-800 border border-blue-700 p-3 rounded mb-3 flex justify-between items-center"
          >
            <div>
              <p><strong>{char.name}</strong></p>
              <p>Level: {char.level}</p>
              <p>Organization: {char.organization}</p>
              <p>Profession: {char.profession || "N/A"}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => approvePending(char.id)}
                className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded"
              >
                Approve
              </button>
              <button
                onClick={() => rejectPending(char.id)}
                className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <p className="max-w-md mx-auto mt-16 text-center text-xs text-gray-500">
        This is a fan-made website and is not officially affiliated with NullSpire or its developers.
      </p>
    </div>
  );
}
