export default function ProgressChart({ completed = 0, total = 0 }) {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base sm:text-lg font-semibold">Flashcard Progress</h3>
        <span className="text-2xl font-bold text-blue-400">{percent}%</span>
      </div>

      <div className="flex justify-between text-xs text-slate-500 mb-2">
        <span>{completed} completed</span>
        <span>{total} total</span>
      </div>

      <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
        <div
          className="h-3 rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${percent}%`,
            background: "linear-gradient(90deg, #3b82f6, #6366f1)",
          }}
        />
      </div>

      {total > 0 && (
        <p className="text-xs text-slate-500 mt-3">
          {total - completed} cards remaining
        </p>
      )}
    </div>
  );
}