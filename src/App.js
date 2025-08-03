import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4">
      <h1 className="text-4xl font-bold text-center mb-6 tracking-widest text-blue-400">
        NullSpire Character Lookup
      </h1>
      <div className="max-w-md mx-auto flex gap-2 mb-4">
        <Input
          placeholder="Enter character name..."
          className="flex-grow bg-gray-800 border border-blue-600 text-white"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-500">
          Search
        </Button>
      </div>

      {error && <p className="text-center text-red-500 mb-4">{error}</p>}

      {character && (
        <Card className="bg-gray-800 border border-blue-700 max-w-md mx-auto mb-6">
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold text-blue-300 mb-2">{character.name}</h2>
            <p><strong>Level:</strong> {character.level}</p>
            <p><strong>Organization:</strong> {character.organization}</p>
            <p><strong>Profession:</strong> {character.profession}</p>
          </CardContent>
        </Card>
      )}

      <div className="max-w-md mx-auto mt-10">
        <h2 className="text-2xl font-semibold text-blue-400 mb-4">Submit a New Character</h2>
        <p className="text-sm text-gray-400 mb-2">This is manual for now, automation coming later.</p>
        <form className="space-y-2">
          <Input placeholder="Name" className="bg-gray-800 border border-gray-700 text-white" />
          <Input placeholder="Level" className="bg-gray-800 border border-gray-700 text-white" />
          <Input placeholder="Organization" className="bg-gray-800 border border-gray-700 text-white" />
          <Input placeholder="Profession" className="bg-gray-800 border border-gray-700 text-white" />
          <Button className="w-full bg-green-600 hover:bg-green-500">Submit</Button>
        </form>
      </div>

      <footer className="text-center text-gray-500 text-sm mt-12">
        <p>This is a fan-made website and is not officially affiliated with NullSpire or its developers.</p>
      </footer>
    </div>
  );
}
