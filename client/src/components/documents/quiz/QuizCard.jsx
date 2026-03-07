import { Brain, Clock, CheckCircle, Circle } from "lucide-react";

export default function QuizCard({ quiz, openQuiz }) {
  const attempt = quiz.latestAttempt;

  const score = attempt?.score ?? null;
  const attemptsCount = attempt?.attemptNumber ?? 0;

  // dynamic score bar color
  const scoreColor =
    score >= 80
      ? "bg-green-500"
      : score >= 50
      ? "bg-yellow-400"
      : "bg-red-500";

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
      "
    >
      {/* TOP HEADER */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs text-gray-400">
            {quiz.title.includes("Attempt")
              ? `Attempt ${quiz.title.split("Attempt")[1].trim()}`
              : ""}
          </p>

          <h3 className="text-lg font-semibold mt-1">
            {quiz.title.replace(/ - Attempt.*/, "")}
          </h3>
        </div>

        <div className="text-xs bg-slate-800 px-3 py-1 rounded-md whitespace-nowrap font-medium text-slate-200">
          {quiz.totalQuestions} Q
        </div>
      </div>

      {/* DATE */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
        <Clock size={14} />
        {new Date(quiz.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </div>

      {/* SCORE OR NOT ATTEMPTED */}
      {score !== null ? (
        <div className="mb-4">
          <div className="flex justify-between items-center text-sm mb-1">
            <span className="flex items-center gap-1 text-green-400">
              <CheckCircle size={14} />
              Score
            </span>

            <span>{score}%</span>
          </div>

          <div className="w-full bg-slate-800 h-2 rounded-full">
            <div
              className={`${scoreColor} h-2 rounded-full`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-yellow-400 mb-4 text-sm">
          <Circle size={14} />
          Not attempted
        </div>
      )}

      {/* ATTEMPTS ROW */}
      <div className="flex justify-between text-sm text-gray-400 mb-5">
        <span>Attempts</span>
        <span>{attemptsCount}</span>
      </div>

      {/* BUTTON */}
      <button
        onClick={openQuiz}
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
        <Brain size={16} />
        Start Quiz
      </button>
    </div>
  );
}