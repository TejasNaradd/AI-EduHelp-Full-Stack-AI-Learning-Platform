import { Clock, Layers, MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import api from "../../api/axios";
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
      await api.delete(`/documents/${docId}/flashcards/set/${set.setId}`);
      toast.success("Flashcard set deleted");
      refresh();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div
      className="
bg-slate-900/90
border border-slate-700
rounded-xl
p-6
flex flex-col justify-between
hover:border-blue-500/50
hover:shadow-xl hover:shadow-blue-500/10
transition-all duration-300
relative
"
    >

      {/* MENU */}

      <div className="absolute right-3 top-3 z-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
          className="
p-2
rounded-lg
text-gray-400
hover:text-white
hover:bg-slate-800
transition
"
        >
          <MoreVertical size={18} />
        </button>

        {menuOpen && (
          <div
            className="
absolute right-0 mt-2
bg-slate-800
border border-slate-700
rounded-lg
shadow-lg
min-w-[120px]
"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteSet();
              }}
              className="
flex items-center gap-2
px-4 py-2
text-red-400
hover:bg-slate-700
w-full
text-sm
"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* HEADER */}

      <div className="mb-4">

        <h2
          className="
text-lg sm:text-xl
font-bold
text-white
leading-snug
tracking-wide
drop-shadow-sm
truncate
"
        >
          {set?.document?.title}
        </h2>

        <p className="text-sm text-gray-400 mt-1">
          Set {index + 1}
        </p>

      </div>

      {/* DATE */}

      <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
        <Clock size={14} />

        {set.createdAt &&
          new Date(set.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
      </div>

      {/* BADGES */}

      <div className="flex justify-between items-center mb-5">

        <div
          className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyStyle}`}
        >
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </div>

        <div
          className="
bg-green-600/90
text-white
text-xs
font-semibold
px-3 py-1
rounded-full
shadow-sm
"
        >
          {totalCards} Cards
        </div>

      </div>

      {/* PROGRESS */}

      <div className="mb-3">

        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">Progress</span>
          <span className="text-gray-200 font-medium">{progress}%</span>
        </div>

        <div className="w-full bg-slate-800 h-2 rounded-full">
          <div
            className="
bg-green-500
h-2
rounded-full
transition-all
"
            style={{ width: `${progress}%` }}
          />
        </div>

      </div>

      {/* REVIEWED */}

      <div className="flex justify-between text-sm text-gray-400 mb-6">

        <span>Reviewed</span>

        <span className="text-gray-200 font-medium">
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
font-medium
py-2.5
rounded-lg
flex items-center justify-center gap-2
text-sm
transition
shadow-md
"
      >
        <Layers size={16} />
        Start Review
      </button>

    </div>
  );
}