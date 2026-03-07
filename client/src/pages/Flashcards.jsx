import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import FlashcardSetCard from "../components/flashcards/FlashcardSetCard";

export default function Flashcards() {

  const [sets, setSets] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const fetchFlashcards = async () => {
    const res = await api.get("/flashcards");

    setSets(res.data.data.sets);
    setFiltered(res.data.data.sets);
  };

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);

    const filteredSets = sets.filter((set) =>
      set.document?.title?.toLowerCase().includes(value)
    );

    setFiltered(filteredSets);
  };

  return (
    <div className="space-y-8">

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-semibold">Flashcards Sets</h1>

        <input
          type="text"
          placeholder="Search FlashcardSets..."
          value={search}
          onChange={handleSearch}
          className="
bg-slate-900
border border-slate-700
rounded-lg
px-4 py-2
text-sm
outline-none
focus:border-blue-500
w-64
"
        />

      </div>

       <div className="mt-2">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((set, index) => (
              <FlashcardSetCard
                key={set.setId}
                set={set}
                index={index}
                docId={set.document._id}
                refresh={fetchFlashcards}
                openSet={() =>
                  navigate(`/flashcards/${set.document._id}/${set.setId}`)
                }
              />
            ))}
          </div>
        </div>

    </div>
  );
}