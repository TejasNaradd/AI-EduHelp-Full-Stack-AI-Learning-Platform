import { Clock, Layers, MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import api from "../../../api/axios";
import toast from "react-hot-toast";

export default function FlashcardSetCard({
  set,
  index,
  docId,
  refresh,
  openSet,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  if (!set) return null;

  const progress = set.progress ?? 0;
  const totalCards = set.totalCards ?? 0;
  const reviewedCards = set.reviewedCards ?? 0;

  const difficulty = set?.difficulty || "medium";

  const difficultyStyle =
    difficulty === "easy"
      ? "bg-green-500/20 text-green-400"
      : difficulty === "medium"
      ? "bg-yellow-500/20 text-yellow-400"
      : "bg-red-500/20 text-red-400";

  const deleteSet = async () => {
    try {
      await api.delete(`/documents/${docId}/flashcards/set/${set._id}`);

      toast.success("Flashcard set deleted");

      refresh();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div
      className="
bg-slate-900/70
backdrop-blur
border border-slate-700
rounded-xl
p-6
flex flex-col justify-between
hover:border-blue-500/40
hover:shadow-xl hover:shadow-blue-500/10
transition-all duration-300
relative
"
    >
      {/* MENU */}

      <div className="absolute right-4 top-4">
        <button onClick={() => setMenuOpen(!menuOpen)}>
          <MoreVertical size={16} />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg">
            <button
              onClick={deleteSet}
              className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-slate-700 w-full"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* HEADER */}

      <div>
        <p className="text-xs text-gray-400">Set {index + 1}</p>

        <h3 className="text-lg font-semibold mt-1">Flashcards</h3>
      </div>

      {/* DATE */}

      <div className="flex items-center gap-2 text-sm text-gray-400 mt-2 mb-3">
        <Clock size={14} />

        {set.createdAt &&
          new Date(set.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
      </div>

      {/* BADGES */}

      <div className="flex justify-between items-center mb-3">
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyStyle}`}
        >
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </div>

        <div className="bg-green-600 text-white text-xs px-3 py-1 rounded-full">
          {totalCards} Cards
        </div>
      </div>

      {/* PROGRESS */}

      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">Progress</span>

          <span>{progress}%</span>
        </div>

        <div className="w-full bg-slate-800 h-2 rounded-full">
          <div
            className="bg-green-500 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* REVIEWED */}

      <div className="flex justify-between text-sm text-gray-400 mb-5">
        <span>Reviewed</span>

        <span>
          {reviewedCards} / {totalCards}
        </span>
      </div>

      {/* BUTTON */}

      <button
        onClick={openSet}
        className="
w-full
bg-gradient-to-r from-blue-600 to-blue-500
hover:from-blue-500 hover:to-blue-400
text-white
py-2.5
rounded-lg
flex items-center justify-center gap-2
text-sm
transition
"
      >
        <Layers size={16} />
        Start Review
      </button>
    </div>
  );
}
