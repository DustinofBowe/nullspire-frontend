import { useState } from "react";
import CharacterPage from "./CharacterPage";
import AdminPage from "./AdminPage";

export default function App() {
  const [page, setPage] = useState("character"); // 'character' or 'admin'

  return (
    <div>
      <nav className="bg-gray-900 text-white p-4 flex justify-center gap-6">
        <button
          onClick={() => setPage("character")}
          className={`px-4 py-2 rounded ${
            page === "character" ? "bg-blue-600" : "bg-gray-700"
          }`}
        >
          Character Lookup
        </button>
        <button
          onClick={() => setPage("admin")}
          className={`px-4 py-2 rounded ${
            page === "admin" ? "bg-blue-600" : "bg-gray-700"
          }`}
        >
          Admin
        </button>
      </nav>
      <main className="p-4">
        {page === "character" ? <CharacterPage /> : <AdminPage />}
      </main>
    </div>
  );
}
