import React, { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import AdminPage from "./AdminPage";

const backendURL = "https://nullspire-api.onrender.com";

function LookupPage() {
  const [lookupName, setLookupName] = useState("");
  const [lookupResult, setLookupResult] = useState(null);

  const handleLookup = () => {
    setLookupResult(null);
    if (!lookupName) return;
    fetch(`${backendURL}/api/characters?name=${encodeURIComponent(lookupName)}`)
      .then((res) => {
        if (res.ok) return res.json();
        else throw new Error("Character Not Found");
      })
      .then((data) => setLookupResult(data))
      .catch(() => setLookupResult({ error: "Character Not Found." }));
  };

  return (
    <div>
      <h1>NullSpire Character Lookup</h1>
      <nav>
        <Link to="/">Lookup</Link> | <Link to="/submit">Submit</Link>
      </nav>

      <input
        type="text"
        placeholder="Enter character name"
        value={lookupName}
        onChange={(e) => setLookupName(e.target.value)}
      />
      <button onClick={handleLookup}>Search</button>

      {lookupResult && (
        <div>
          {lookupResult.error ? (
            <p>{lookupResult.error}</p>
          ) : (
            <div>
              <p>Name: {lookupResult.name}</p>
              <p>Level: {lookupResult.level}</p>
              <p>Organization: {lookupResult.organization}</p>
              <p>Profession: {lookupResult.profession}</p>
            </div>
          )}
        </div>
      )}

      <footer style={{ marginTop: "30px", fontSize: "12px", color: "gray" }}>
        This is a fan site and is not officially affiliated with NullSpire.
      </footer>
    </div>
  );
}

function SubmitPage() {
  const [submitData, setSubmitData] = useState({
    name: "",
    level: "",
    organization: "",
    profession: "",
  });
  const [submitMessage, setSubmitMessage] = useState("");

  const handleSubmit = () => {
    const { name, level, organization, profession } = submitData;
    if (!name || !level || !organization || !profession) {
      setSubmitMessage("Missing fields");
      return;
    }

    setSubmitMessage("");
    fetch(`${backendURL}/api/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submitData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setSubmitMessage("Submission failed: " + data.error);
        else setSubmitMessage("Submission successful, pending approval.");
        setSubmitData({ name: "", level: "", organization: "", profession: "" });
      })
      .catch(() => setSubmitMessage("Submission failed"));
  };

  return (
    <div>
      <h1>Submit a Character</h1>
      <nav>
        <Link to="/">Lookup</Link> | <Link to="/submit">Submit</Link>
      </nav>

      <input
        type="text"
        placeholder="Name"
        value={submitData.name}
        onChange={(e) => setSubmitData({ ...submitData, name: e.target.value })}
      />
      <input
        type="number"
        placeholder="Level"
        value={submitData.level}
        onChange={(e) => setSubmitData({ ...submitData, level: e.target.value })}
      />
      <input
        type="text"
        placeholder="Organization"
        value={submitData.organization}
        onChange={(e) =>
          setSubmitData({ ...submitData, organization: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Profession"
        value={submitData.profession}
        onChange={(e) =>
          setSubmitData({ ...submitData, profession: e.target.value })
        }
      />
      <button onClick={handleSubmit}>Submit</button>
      {submitMessage && <p>{submitMessage}</p>}
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LookupPage />} />
      <Route path="/submit" element={<SubmitPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}

export default App;
