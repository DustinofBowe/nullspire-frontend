import { useState } from "react";

export default function CharacterPage() {
  const [query, setQuery] = useState("");
  const [character, setCharacter] = useState(null);
  const [error, setError] = useState(null);
  const [submitForm, setSubmitForm] = useState({ name: "", level: "", organization: "", profession: "" });
  const [submitMessage, setSubmitMessage] = useState("");

  const handleSearch = async () => {
    setError(null);
    setCharacter(null);
    if (!query.trim()) {
      setError("Please enter a character name.");
      return;
    }
    try {
      const response = await fetch(
        `https://nullspire-api.onrender.com/api/characters?name=${encodeURIComponent(query)}`
      );
      if (!response.ok) {
        throw new Error("Character not found.");
      }
      const data = await response.json();
      setCharacter(data);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitMessage("");
    if (!submitForm.name || !submitForm.level || !submitForm.organization || !submitForm.profession) {
      setSubmitMessage("All fields are required.");
      return;
    }
    try {
      const response = await fetch("https://nullspire-api.onrender.com/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitForm),
      });
      const data = await response.json();
      if (response.ok) {
        setSubmitMessage(data.message);
        setSubmitForm({ name: "", level: "", organization: "", profession: "" });
      } else {
        setSubmitMessage(data.error || "Submission failed.");
      }
    } catch {
      setSubmitMessage("Submission failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 max-w-md mx-auto">
      <h1 className="text-4xl font-bold text-center mb-6 tracking-widest text-blue-400">
        NullSpire Character Lookup
      </h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter character name..."
          className="flex-grow bg-gray-800 border border-blue-600 text-white p-2 rounded"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-500 px-4 rounded"
        >
          Search
        </button>
      </div>
      {error && <p className="text-center text-red-500 mb-4">{error}</p>}
      {character && (
        <div className="bg-gray-800 border border-blue-700 p-4 rounded mb-6">
          <h2 className="text-xl font-semibold text-blue-300 mb-2">{character.name}</h2>
          <p><strong>Level:</strong> {character.level}</p>
          <p><strong>Organization:</strong> {character.organization}</p>
          <p><strong>Profession:</strong> {character.profession}</p>
        </div>
      )}
      <div>
        <h2 className="text-2xl font-semibold text-blue-400 mb-4">Submit a New Character</h2>
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            placeholder="Name"
            value={submitForm.name}
            onChange={(e) => setSubmitForm({ ...submitForm, name: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 text-white p-2 rounded"
          />
          <input
            type="number"
            placeholder="Level"
            value={submitForm.level}
            onChange={(e) => setSubmitForm({ ...submitForm, level: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 text-white p-2 rounded"
          />
          <input
            placeholder="Organization"
            value={submitForm.organization}
            onChange={(e) => setSubmitForm({ ...submitForm, organization: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 text-white p-2 rounded"
          />
          <input
            placeholder="Profession"
            value={submitForm.profession}
            onChange={(e) => setSubmitForm({ ...submitForm, profession: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 text-white p-2 rounded"
          />
          <button type="submit" className="w-full bg-green-600 hover:bg-green-500 py-2 rounded">
            Submit
          </button>
        </form>
        {submitMessage && <p className="mt-2 text-center">{submitMessage}</p>}
      </div>
      <p className="text-gray-500 mt-6 text-center text-xs">
        This is a fan-made site and is not officially affiliated with NullSpire.
      </p>
    </div>
  );
}
