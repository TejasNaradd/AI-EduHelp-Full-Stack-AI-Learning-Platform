export default function ProgressChart({ completed = 0, total = 0 }) {
  const percent = total === 0 ? 0 : (completed / total) * 100;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4">
        Flashcard Progress
      </h3>

      <p className="text-slate-400 text-sm mb-2">
        {completed} / {total} Completed
      </p>

      <div className="w-full bg-slate-800 rounded-full h-3">
        <div
          className="bg-blue-500 h-3 rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}