import { useState } from "react";

const mockDatabase = [
  { name: "Opifex2012", level: 13, organization: "Cultist", profession: "Warlock" },
  { name: "Nit", level: 4, organization: "Engineer", profession: "Technician" },
];

export default function CharacterLookup() {
  const [query, setQuery] = useState("");
  const [character, setCharacter] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = () => {
    setError(null);
    setCharacter(null);
    const found = mockDatabase.find(
      (c) => c.name.toLowerCase() === query.toLowerCase()
    );
    if (found) {
      setCharacter(found);
    } else {
      setError("Character not found.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom right, #1a1a2e, #000)", color: "white", padding: "1rem" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", textAlign: "center", marginBottom: "1.5rem", letterSpacing: "0.1em", color: "#60a5fa" }}>
        NullSpire Character Lookup
      </h1>

      <div style={{ maxWidth: "400px", margin: "0 auto", display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          placeholder="Enter character name..."
          style={{ flexGrow: 1, backgroundColor: "#1f2937", border: "1px solid #3b82f6", color: "white", padding: "0.5rem", borderRadius: "0.375rem" }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          style={{ backgroundColor: "#3b82f6", padding: "0.5rem 1rem", borderRadius: "0.375rem", color: "white", fontWeight: "bold" }}
        >
          Search
        </button>
      </div>

      {error && <p style={{ textAlign: "center", color: "#f87171", marginBottom: "1rem" }}>{error}</p>}

      {character && (
        <div style={{ backgroundColor: "#1f2937", border: "1px solid #2563eb", borderRadius: "0.5rem", maxWidth: "400px", margin: "0 auto", padding: "1rem", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#93c5fd", marginBottom: "0.5rem" }}>{character.name}</h2>
          <p><strong>Level:</strong> {character.level}</p>
          <p><strong>Organization:</strong> {character.organization}</p>
          <p><strong>Profession:</strong> {character.profession}</p>
        </div>
      )}

      <div style={{ maxWidth: "400px", margin: "2rem auto 0" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#60a5fa", marginBottom: "0.5rem" }}>Submit a New Character</h2>
        <p style={{ fontSize: "0.875rem", color: "#9ca3af", marginBottom: "0.5rem" }}>This is manual for now, automation coming later.</p>
        <form className="space-y-2">
          <input placeholder="Name" style={inputStyle} />
          <input placeholder="Level" style={inputStyle} />
          <input placeholder="Organization" style={inputStyle} />
          <input placeholder="Profession" style={inputStyle} />
          <button style={{ width: "100%", backgroundColor: "#22c55e", padding: "0.5rem", borderRadius: "0.375rem", color: "white", fontWeight: "bold" }}>
            Submit
          </button>
        </form>
      </div>

      <footer style={{ textAlign: "center", color: "#6b7280", fontSize: "0.875rem", marginTop: "3rem" }}>
        <p>This is a fan-made website and is not officially affiliated with NullSpire or its developers.</p>
      </footer>
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  backgroundColor: "#1f2937",
  border: "1px solid #374151",
  color: "white",
  padding: "0.5rem",
  marginBottom: "0.5rem",
  borderRadius: "0.375rem"
};
