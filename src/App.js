import React, { useState, useEffect } from "react";

const API_BASE = "https://nullspire-api.onrender.com";
const ADMIN_PASSWORD = "ChatGPT123";

function App() {
  const [path, setPath] = useState(window.location.pathname);

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

      <d
