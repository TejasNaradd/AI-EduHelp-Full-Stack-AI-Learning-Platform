import { useEffect, useState } from "react";
import api from "../../../api/axios";
import toast from "react-hot-toast";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function FlashcardViewer({ docId, setId, goBack }) {

  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await api.get(
          `/documents/${docId}/flashcards/set/${setId}`
        );

        setCards(res?.data?.data?.cards || []);
      } catch (err) {
        toast.error("Failed to load flashcards");
      }
    };

    fetchCards();
  }, []);

  if (cards.length === 0) {
    return <p className="text-gray-400">Loading flashcards...</p>;
  }

  const card = cards[index];

  const markReviewed = async () => {
    try {
      await api.patch(`/flashcards/review/${card._id}`);

      toast.success("Marked as reviewed");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const nextCard = () => {
    if (index < cards.length - 1) {
      setIndex(index + 1);
      setShowAnswer(false);
    }
  };

  const prevCard = () => {
    if (index > 0) {
      setIndex(index - 1);
      setShowAnswer(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <button onClick={goBack} className="text-gray-400 text-sm">
        ← Back
      </button>

      <p className="text-center text-gray-400 text-sm">
        Card {index + 1} / {cards.length}
      </p>

      {/* CARD */}

      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-10 text-center space-y-8">
        {/* QUESTION */}

        {!showAnswer && (
          <>
            <p className="text-blue-400 text-xs tracking-widest font-semibold">
              QUESTION
            </p>

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-lg text-white">
              {card.question}
            </div>

            <button
              onClick={() => setShowAnswer(true)}
              className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg"
            >
              Show Answer
            </button>
          </>
        )}

        {/* ANSWER */}

        {showAnswer && (
          <>
            <p className="text-green-400 text-xs tracking-widest font-semibold">
              ANSWER
            </p>

            <div className="bg-slate-700 border border-slate-600 rounded-xl p-8 text-lg text-white">
              {card.answer}
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowAnswer(false)}
                className="bg-slate-700 hover:bg-slate-600 px-5 py-2 rounded-lg"
              >
                Back to Question
              </button>

              <button
                onClick={markReviewed}
                className="bg-green-600 hover:bg-green-500 px-5 py-2 rounded-lg"
              >
                Mark Reviewed
              </button>
            </div>
          </>
        )}
      </div>

      {/* NAVIGATION */}

      <div className="flex justify-between items-center">
        <button
          onClick={prevCard}
          disabled={index === 0}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg disabled:opacity-40"
        >
          <ArrowLeft size={16} />
          Previous
        </button>

        {index === cards.length - 1 ? (
          <button
            onClick={goBack}
            className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg"
          >
            Finish Review
          </button>
        ) : (
          <button
            onClick={nextCard}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg"
          >
            Next
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
