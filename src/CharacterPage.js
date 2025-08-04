import { useState } from "react";

const API_URL = "https://nullspire-api.onrender.com/api";

export default function CharacterPage() {
  const [query, setQuery] = useState("");
  const [character, setCharacter] = useState(null);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: "", level: "", organization: "", profession: "" });
  const [message, setMessage] = useState("");

  const handleSearch = async () => {
    setError(""); setCharacter(null);
    if (!query) return;
    const res = await fetch(`${API_URL}/characters?name=${encodeURIComponent(query)}`);
    if (res.ok) {
      setCharacter(await res.json());
    } else {
      setError("Character not found.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const res = await fetch(`${API_URL}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setMessage(res.ok ? (data.message || "Pending approval.") : (data.error || "Submission failed."));
    if (res.ok) setForm({ name: "", level: "", organization: "", profession: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-400">NullSpire Character Lookup</h1>

      <div className="max-w-md mx-auto flex gap-2 mb-4">
        <input
          placeholder="Enter character name..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="flex-grow bg-gray-800 border border-blue-600 text-white p-2 rounded"
        />
        <button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-500 px-4 rounded">
          Search
        </button>
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {character && (
        <div className="bg-gray-800 border border-blue-700 max-w-md mx-auto p-4 rounded mb-6">
          <h2 className="text-xl font-semibold text-blue-300 mb-2">{character.name}</h2>
          <p><strong>Level:</strong> {character.level}</p>
          <p><strong>Organization:</strong> {character.organization}</p>
          <p><strong>Profession:</strong> {character.profession}</p>
        </div>
      )}

      <div className="max-w-md mx-auto mt-10">
        <h2 className="text-2xl font-semibold text-blue-400 mb-4">Submit a New Character</h2>
        <form onSubmit={handleSubmit} className="space-y-2">
          <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-gray-800 p-2 rounded text-white" />
          <input placeholder="Level" value={form.level} onChange={e => setForm({ ...form, level: e.target.value })} className="w-full bg-gray-800 p-2 rounded text-white" />
          <input placeholder="Organization" value={form.organization} onChange={e => setForm({ ...form, organization: e.target.value })} className="w-full bg-gray-800 p-2 rounded text-white" />
          <input placeholder="Profession" value={form.profession} onChange={e => setForm({ ...form, profession: e.target.value })} className="w-full bg-gray-800 p-2 rounded text-white" />
          <button type="submit" className="w-full bg-green-600 hover:bg-green-500 p-2 rounded">Submit</button>
        </form>
        {message && <p className="text-center mt-2 text-yellow-400">{message}</p>}
      </div>

      <footer className="mt-20 text-center text-gray-500 text-sm">
        This is a fan-made site and is not affiliated with NullSpire.
      </footer>
    </div>
  );
}
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
