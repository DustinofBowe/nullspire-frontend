import { useState } from "react";

const API_URL = "https://nullspire-api.onrender.com";

export default function CharacterLookup() {
  const [query, setQuery] = useState("");
  const [character, setCharacter] = useState(null);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: "", level: "", organization: "", profession: "" });
  const [message, setMessage] = useState(null);

  const handleSearch = async () => {
    setError(null);
    setCharacter(null);
    try {
      const res = await fetch(`${API_URL}/api/characters?name=${query}`);
      if (!res.ok) throw new Error("Character not found");
      const data = await res.json();
      setCharacter(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      const res = await fetch(`${API_URL}/api/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setMessage(data.message);
      setForm({ name: "", level: "", organization: "", profession: "" });
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4">
      <h1 className="text-4xl font-bold text-center mb-6 tracking-widest text-blue-400">
        NullSpire Character Lookup
      </h1>

      <div className="max-w-md mx-auto flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter character name..."
          className="flex-grow bg-gray-800 border border-blue-600 text-white p-2 rounded"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded">
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
        <p className="text-sm text-gray-400 mb-2">This is manual for now, automation coming later.</p>
        <form className="space-y-2" onSubmit={handleSubmit}>
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 text-white p-2 rounded"
          />
          <input
            placeholder="Level"
            value={form.level}
            onChange={(e) => setForm({ ...form, level: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 text-white p-2 rounded"
          />
          <input
            placeholder="Organization"
            value={form.organization}
            onChange={(e) => setForm({ ...form, organization: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 text-white p-2 rounded"
          />
          <input
            placeholder="Profession"
            value={form.profession}
            onChange={(e) => setForm({ ...form, profession: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 text-white p-2 rounded"
          />
          <button type="submit" className="w-full bg-green-600 hover:bg-green-500 px-4 py-2 rounded">
            Submit
          </button>
        </form>
        {message && <p className="text-center mt-2 text-yellow-400">{message}</p>}
      </div>

      <footer className="text-center text-sm text-gray-500 mt-20">
        This is a fan-made site and is not officially affiliated with NullSpire or its developers.
      </footer>
    </div>
  );
}
