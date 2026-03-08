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
      const msg = err.response?.data?.message || "Generation failed";
      if (
        msg.toLowerCase().includes("topic") ||
        msg.toLowerCase().includes("summary")
      ) {
        toast.error(
          "Please generate a summary first before creating flashcards!"
        );
      } else {
        toast.error(msg);
      }
    }
  }

  if (activeSet) {
    return (
      <FlashcardViewer
        docId={docId}
        setId={activeSet}
        goBack={() => {
          setActiveSet(null);
          fetchSets();
        }}
      />
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
          <Layers size={20} className="shrink-0" />
          Flashcards
        </h2>

        <button
          onClick={generateFlashcards}
          className="
          flex items-center justify-center gap-2
          bg-blue-600 hover:bg-blue-500
          px-4 py-2 rounded-lg text-white
          w-full sm:w-auto
          "
        >
          <Plus size={16} />
          Generate Flashcards
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-gray-400 text-sm sm:text-base">
          Loading flashcards...
        </p>
      )}

      {/* Empty state */}
      {!loading && sets.length === 0 && (
        <div className="text-center mt-10 sm:mt-14">
          <p className="text-gray-400 text-sm sm:text-base">
            No flashcards yet. Generate one to start learning.
          </p>
        </div>
      )}

      {/* Grid */}
      {!loading && sets.length > 0 && (
        <div
          className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-2
          xl:grid-cols-3
          gap-4
          sm:gap-6
          lg:gap-8
          "
        >
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
      )}
    </div>
  );
}
