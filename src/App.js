// src/App.js
import React, { useState, useEffect } from "react";

const backendURL = "https://nullspire-api.onrender.com"; // Your backend URL here

function App() {
  const [lookupName, setLookupName] = useState("");
  const [lookupResult, setLookupResult] = useState(null);
  const [submitName, setSubmitName] = useState("");
  const [submitLevel, setSubmitLevel] = useState("");
  const [submitOrg, setSubmitOrg] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");

  // Character Lookup Handler
  async function handleLookup(e) {
    e.preventDefault();
    setLookupResult(null);
    if (!lookupName) return;
    try {
      const res = await fetch(`${backendURL}/api/characters?name=${encodeURIComponent(lookupName)}`);
      if (!res.ok) {
        setLookupResult({ error: "Character not found." });
        return;
      }
      const data = await res.json();
      setLookupResult(data);
    } catch {
      setLookupResult({ error: "Failed to fetch data." });
    }
  }

  // Character Submit Handler
  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitMessage("");
    if (!submitName || !submitLevel || !submitOrg) {
      setSubmitMessage("Please fill all fields.");
      return;
    }
    try {
      const res = await fetch(`${backendURL}/api/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: submitName,
          level: submitLevel,
          organization: submitOrg,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitMessage(data.message);
        setSubmitName("");
        setSubmitLevel("");
        setSubmitOrg("");
      } else {
        setSubmitMessage(data.error || "Submission failed.");
      }
    } catch {
      setSubmitMessage("Failed to submit.");
    }
  }

  return (
    <div style={{ maxWidth: 500, margin: "auto", padding: 20 }}>
      <h2>NullSpire Character Lookup</h2>
      <form onSubmit={handleLookup}>
        <input
          type="text"
          placeholder="Enter character name"
          value={lookupName}
          onChange={(e) => setLookupName(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <button type="submit" style={{ width: "100%", padding: 8 }}>
          Lookup
        </button>
      </form>
      {lookupResult && (
        <div style={{ marginTop: 20 }}>
          {lookupResult.error ? (
            <p style={{ color: "red" }}>{lookupResult.error}</p>
          ) : (
            <>
              <p><strong>Name:</strong> {lookupResult.name}</p>
              <p><strong>Level:</strong> {lookupResult.level}</p>
              <p><strong>Organization:</strong> {lookupResult.organization}</p>
            </>
          )}
        </div>
      )}

      <hr style={{ margin: "40px 0" }} />

      <h2>Submit New Character</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={submitName}
          onChange={(e) => setSubmitName(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <input
          type="number"
          placeholder="Level"
          value={submitLevel}
          onChange={(e) => setSubmitLevel(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
          min="1"
        />
        <input
          type="text"
          placeholder="Organization"
          value={submitOrg}
          onChange={(e) => setSubmitOrg(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <button type="submit" style={{ width: "100%", padding: 8 }}>
          Submit
        </button>
      </form>
      {submitMessage && <p style={{ marginTop: 12 }}>{submitMessage}</p>}
    </div>
  );
}

export default App;
