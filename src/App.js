import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CharacterPage from "./CharacterPage";
import AdminPage from "./AdminPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CharacterPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
