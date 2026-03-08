export default function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 hover:border-indigo-500/50 transition-all duration-300 shadow-lg hover:shadow-indigo-500/10 group">
      <div className="flex justify-between items-start mb-3 sm:mb-4">
        <span className="text-slate-400 text-xs sm:text-sm leading-tight">{title}</span>
        {Icon && (
          <div className="p-1.5 sm:p-2 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 transition-colors shrink-0 ml-2">
            <Icon size={16} className="text-indigo-400 sm:w-[18px] sm:h-[18px]" />
          </div>
        )}
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{value}</h2>
    </div>
  );
}