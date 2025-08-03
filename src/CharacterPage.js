// CharacterPage.js
import { useState } from "react";

const API_BASE = "https://nullspire-api.onrender.com";

export default function CharacterPage() {
  const [query, setQuery] = useState("");
  const [character, setCharacter] = useState(null);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: "", level: "", organization: "", profession: "" });
  const [submitMessage, setSubmitMessage] = useState(null);

  const handleSearch = async () => {
    setError(null);
    setCharacter(null);
    try {
      const res = await fetch(`${API_BASE}/api/characters?name=${query}`);
      if (!res.ok) throw new Error("Character not found.");
      const data = await res.json();
      setCharacter(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitMessage(null);
    try {
      const res = await fetch(`${API_BASE}/api/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed.");
      setSubmitMessage("Character submitted successfully.");
      setForm({ name: "", level: "", organization: "", profession: "" });
    } catch (err) {
      setSubmitMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4">
      <h1 className="text-4xl font-bold text-center mb-6 tracking-widest text-blue-400">
        NullSpire Character Lookup
      </h1>

      <div className="max-w-md mx-auto flex gap-2 mb-4">
        <input
          placeholder="Enter character name..."
          className="flex-grow bg-gray-800 border border-blue-600 text-white p-2"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-500 p-2 px-4 rounded">
          Search
        </button>
      </div>

      {error && <p className="text-center text-red-500 mb-4">{error}</p>}

      {character && (
        <div className="bg-gray-800 border border-blue-700 max-w-md mx-auto mb-6 p-4 rounded">
          <h2 className="text-xl font-semibold text-blue-300 mb-2">{character.name}</h2>
          <p><strong>Level:</strong> {character.level}</p>
          <p><strong>Organization:</strong> {character.organization}</p>
          <p><strong>Profession:</strong> {character.profession}</p>
        </div>
      )}

      <div className="max-w-md mx-auto mt-10">
        <h2 className="text-2xl font-semibold text-blue-400 mb-4">Submit a New Character</h2>
        <form className="space-y-2" onSubmit={handleSubmit}>
          <input
            placeholder="Name"
            className="bg-gray-800 border border-gray-700 text-white p-2 w-full"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="Level"
            className="bg-gray-800 border border-gray-700 text-white p-2 w-full"
            value={form.level}
            onChange={(e) => setForm({ ...form, level: e.target.value })}
          />
          <input
            placeholder="Organization"
            className="bg-gray-800 border border-gray-700 text-white p-2 w-full"
            value={form.organization}
            onChange={(e) => setForm({ ...form, organization: e.target.value })}
          />
          <input
            placeholder="Profession"
            className="bg-gray-800 border border-gray-700 text-white p-2 w-full"
            value={form.profession}
            onChange={(e) => setForm({ ...form, profession: e.target.value })}
          />
          <button className="w-full bg-green-600 hover:bg-green-500 p-2 rounded">Submit</button>
        </form>
        {submitMessage && <p className="mt-2 text-sm text-yellow-400">{submitMessage}</p>}
      </div>

      <footer className="mt-20 text-center text-gray-500 text-sm">
        This is a fan-made site and is not affiliated with NullSpire or its developers.
      </footer>
    </div>
  );
}
