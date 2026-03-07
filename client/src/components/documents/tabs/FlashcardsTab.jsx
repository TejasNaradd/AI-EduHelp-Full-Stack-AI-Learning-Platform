import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../api/axios.js";
import toast from "react-hot-toast";
import FlashcardSetCard from "../flashcards/FlashcardSetCard.jsx";
import FlashcardViewer from "../flashcards/FlashcardViewer.jsx";
import { Layers, Plus } from "lucide-react";

export default function FlashcardsTab() {
  const { docId } = useParams();

  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSet, setActiveSet] = useState(null);

  const fetchSets = async () => {
    try {
      const res = await api.get(`/documents/${docId}/flashcards`);
      const setsData = res?.data?.data?.sets || [];

      setSets(setsData);
    } catch (err) {
      toast.error("Failed to fetch flashcards");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSets();
  }, []);

  const generateFlashcards = async () => {
    try {
      toast.loading("Generating flashcards...");

      await api.post(`/documents/${docId}/flashcards/generate`);

      toast.dismiss();
      toast.success("Flashcards generated");

      fetchSets();
    } catch (err) {
      toast.dismiss();
      toast.error("Generation failed");
    }
  };

  if (activeSet) {
    return (
      <FlashcardViewer
        docId={docId}
        setId={activeSet}
        goBack={() => {
          setActiveSet(null);
          fetchSets();   // refresh sets so progress updates
        }}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Layers size={22} />
          Flashcards
        </h2>

        <button
          onClick={generateFlashcards}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-white"
        >
          <Plus size={16} />
          Generate Flashcards
        </button>
      </div>

      {loading && <p className="text-gray-400">Loading flashcards...</p>}

      {!loading && sets.length === 0 && (
        <p className="text-gray-400 text-center mt-12">
          No flashcards yet. Generate one to start learning.
        </p>
      )}

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
        {sets?.map((set, index) => (
          <FlashcardSetCard
            key={set?._id || index}
            set={set}
            index={index}
            docId={docId}
            refresh={fetchSets}
            openSet={() => setActiveSet(set._id)}
          />
        ))}
      </div>
    </div>
  );
}
