import React from "react";

export default function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500 transition duration-300 shadow-lg hover:shadow-indigo-500/10">
      <div className="flex justify-between items-center mb-4">
        <span className="text-slate-400 text-sm">{title}</span>

        {Icon && (
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <Icon size={18} className="text-indigo-400" />
          </div>
        )}
      </div>

      <h2 className="text-3xl font-bold">{value}</h2>
    </div>
  );
}