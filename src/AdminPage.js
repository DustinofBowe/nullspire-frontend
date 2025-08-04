import { useState, useEffect } from "react";

const ADMIN_PASSWORD = "ChatGPT123";
const API_BASE = "https://nullspire-api.onrender.com/api";

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [selectedTab, setSelectedTab] = useState("pending");
  const [error, setError] = useState(null);

  const login = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setLoggedIn(true);
      setError(null);
      fetchPending();
      fetchApproved();
    } else {
      setError("Incorrect password");
    }
  };

  const fetchPending = () => {
    fetch(`${API_BASE}/pending`, {
      headers: { "x-admin-password": ADMIN_PASSWORD },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized or error fetching pending");
        return res.json();
      })
      .then(setPending)
      .catch((e) => setError(e.message));
  };

  const fetchApproved = () => {
    fetch(`${API_BASE}/approved`, {
      headers: { "x-admin-password": ADMIN_PASSWORD },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized or error fetching approved");
        return res.json();
      })
      .then(setApproved)
      .catch((e) => setError(e.message));
  };

  const approve = (id) => {
    fetch(`${API_BASE}/pending/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": ADMIN_PASSWORD,
      },
      body: JSON.stringify({ id }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to approve");
        return res.json();
      })
      .then(() => {
        fetchPending();
        fetchApproved();
      })
      .catch((e) => setError(e.message));
  };

  const reject = (id) => {
    fetch(`${API_BASE}/pending/reject`, {
      method: "POST",
