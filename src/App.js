import { useState, useEffect } from "react";

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
      <
