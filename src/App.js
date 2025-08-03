import { useState } from "react";

const API_BASE = "https://nullspire-api.onrender.com";

function App() {
  const [query, setQuery] = useState("");
  const [character, setCharacter] = useState(null);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: "", level: "", organization: "" });

  const handleSearch = async () => {
    setError(null);
    setCharacter(null);
    try {
      const res = await fetch(`${API_BASE}/api/characters?name=${query}`);
      if (!res.ok) throw new Error("Character not found");
      const data = await res.json();
      setCharacter(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      alert("Character submitted!");
      setForm({ name: "", level: "", organization: "" });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container">
      <h1>NullSpire Character Lookup</h1>
      <div className="search">
        <input
          type="text"
          placeholder="Enter character name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {error && <p className="error">{error}</p>}
      {character && (
        <div className="card">
          <h2>{character.name}</h2>
          <p>Level: {character.level}</p>
          <p>Organization: {character.organization}</p>
        </div>
      )}
      <div className="form-section">
        <h2>Submit New Character</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Level"
            value={form.level}
            onChange={(e) => setForm({ ...form, level: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Organization"
            value={form.organization}
            onChange={(e) => setForm({ ...form, organization: e.target.value })}
            required
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default App;
