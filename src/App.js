import React, { useState } from "react";

const backendURL = "https://nullspire-api.onrender.com"; // Replace with your backend URL

function App() {
  const [page, setPage] = useState("lookup"); // 'lookup', 'submit', 'admin-login', or 'admin'
  const [lookupName, setLookupName] = useState("");
  const [lookupResult, setLookupResult] = useState(null);
  const [submitData, setSubmitData] = useState({
    name: "",
    level: "",
    organization: "",
    profession: "",
  });
  const [submitMessage, setSubmitMessage] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);

  // Fetch pending characters (admin)
  const fetchPending = () => {
    fetch(`${backendURL}/api/pending`, {
      headers: { "x-admin-password": adminPassword },
    })
      .then((res) => res.json())
      .then((data) => setPending(data))
      .catch(() => setPending([]));
  };

  // Fetch approved characters (admin)
  const fetchApproved = () => {
    fetch(`${backendURL}/api/approved`, {
      headers: { "x-admin-password": adminPassword },
    })
      .then((res) => res.json())
      .then((data) => setApproved(data))
      .catch(() => setApproved([]));
  };

  // Lookup character by name
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

  // Submit new character
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

  // Admin login
  const handleAdminLogin = () => {
    fetch(`${backendURL}/api/pending`, {
      headers: { "x-admin-password": adminPassword },
    })
      .then((res) => {
        if (res.status === 401) throw new Error("Unauthorized");
        if (!res.ok) throw new Error("Error");
        return res.json();
      })
      .then((data) => {
        setAdminLoggedIn(true);
        setPending(data);
        fetchApproved();
        setPage("admin");
        setAdminError("");
      })
      .catch(() => setAdminError("Invalid password"));
  };

  // Approve character
  const approveCharacter = (id) => {
    fetch(`${backendURL}/api/pending/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": adminPassword,
      },
      body: JSON.stringify({ id }),
    })
      .then(() => {
        fetchPending();
        fetchApproved();
      });
  };

  // Reject character
  const rejectCharacter = (id) => {
    fetch(`${backendURL}/api/pending/reject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": adminPassword,
      },
      body: JSON.stringify({ id }),
    })
      .then(() => fetchPending());
  };

  // Delete approved character
  const deleteApproved = (id) => {
    fetch(`${backendURL}/api/approved/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": adminPassword,
      },
      body: JSON.stringify({ id }),
    }).then(() => fetchApproved());
  };

  // Edit approved character inline
  const editApprovedCharacter = (id, field, value) => {
    fetch(`${backendURL}/api/approved/edit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": adminPassword,
      },
      body: JSON.stringify({ id, field, value }),
    }).then(() => fetchApproved());
  };

  // Admin page JSX
  const AdminPage = () => (
    <div>
      <h2>Pending Characters</h2>
      {pending.length === 0 && <p>No pending characters.</p>}
      <ul>
        {pending.map((c) => (
          <li key={c.id}>
            {c.name} - Level {c.level} - {c.organization} - {c.profession}{" "}
            <button onClick={() => approveCharacter(c.id)}>Approve</button>{" "}
            <button onClick={() => rejectCharacter(c.id)}>Reject</button>
          </li>
        ))}
      </ul>

      <h2>Approved Characters</h2>
      {approved.length === 0 && <p>No approved characters.</p>}
      <ul>
        {approved.map((c) => (
          <li key={c.id}>
            <input
              type="text"
              value={c.name}
              onChange={(e) => editApprovedCharacter(c.id, "name", e.target.value)}
            />{" "}
            - Level{" "}
            <input
              type="number"
              value={c.level}
              onChange={(e) => editApprovedCharacter(c.id, "level", e.target.value)}
              style={{ width: "50px" }}
            />{" "}
            -{" "}
            <input
              type="text"
              value={c.organization}
              onChange={(e) => editApprovedCharacter(c.id, "organization", e.target.value)}
            />{" "}
            -{" "}
            <input
              type="text"
              value={c.profession}
              onChange={(e) => editApprovedCharacter(c.id, "profession", e.target.value)}
            />{" "}
            <button onClick={() => deleteApproved(c.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <button
        onClick={() => {
          setAdminLoggedIn(false);
          setAdminPassword("");
          setPage("lookup");
        }}
      >
        Logout
      </button>
    </div>
  );

  if (page === "admin-login") {
    return (
      <div>
        <h2>Admin Login</h2>
        <input
          type="password"
          placeholder="Password"
          value={adminPassword}
          onChange={(e) => setAdminPassword(e.target.value)}
        />
        <button onClick={handleAdminLogin}>Login</button>
        {adminError && <p style={{ color: "red" }}>{adminError}</p>}
        <button onClick={() => setPage("lookup")}>Back</button>
      </div>
    );
  }

  if (page === "admin") {
    return <AdminPage />;
  }

  return (
    <div>
      <h1>NullSpire Character Lookup</h1>

      <button onClick={() => setPage("lookup")}>Character Lookup</button>{" "}
      <button onClick={() => setPage("submit")}>Submit Character</button>{" "}
      <button onClick={() => setPage("admin-login")}>Admin Login</button>

      {page === "lookup" && (
        <div>
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
        </div>
      )}

      {page === "submit" && (
        <div>
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
      )}

      <footer style={{ marginTop: "30px", fontSize: "12px", color: "gray" }}>
        This is a fan site and is not officially affiliated with NullSpire.
      </footer>
    </div>
  );
}

export default App;
