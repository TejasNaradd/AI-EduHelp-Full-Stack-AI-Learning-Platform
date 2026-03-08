import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

function getMonthFromISOWeek(year, week) {
  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const dayOfWeek = simple.getDay();
  const ISOweekStart = simple;
  if (dayOfWeek <= 4)
    ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  else
    ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  return ISOweekStart.toLocaleString("default", { month: "short" });
}

function formatWeekLabel(label) {
  if (!label) return "";
  const [year, weekPart] = label.split("-W");
  return `W${weekPart}`;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  const [year, weekPart] = label.split("-W");
  const month = getMonthFromISOWeek(parseInt(year), parseInt(weekPart));
  return (
    <div className="bg-slate-800 border border-slate-600 px-4 py-3 rounded-xl shadow-xl">
      <p className="text-xs text-slate-400 mb-1">
        Week {weekPart} • {month} {year}
      </p>
      <p className="text-indigo-400 font-bold text-xl">
        {payload[0].value}
      </p>
      <p className="text-xs text-slate-500">
        {payload[0].name === "count" ? "uploads" : "avg score"}
      </p>
    </div>
  );
};

export default function AnalyticsCharts({
  weeklyUploads = [],
  scoreTrend = [],
}) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

      {/* Weekly Uploads */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-base sm:text-lg font-semibold">Weekly Document Activity</h3>
            <p className="text-xs text-slate-500 mt-0.5">Documents uploaded per week</p>
          </div>
          <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded-lg">
            {weeklyUploads.length} weeks
          </span>
        </div>

        {weeklyUploads.length === 0 ? (
          <div className="h-48 flex items-center justify-center">
            <p className="text-slate-500 text-sm">No upload data yet.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyUploads} barCategoryGap="35%" barGap={4}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity={1} />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1e293b" strokeDasharray="4 4" vertical={false} />
              <XAxis
                dataKey="week"
                stroke="#475569"
                tick={{ fontSize: 11, fill: "#64748b" }}
                tickFormatter={formatWeekLabel}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                stroke="#475569"
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                width={24}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.05)", radius: 8 }} />
              <Bar dataKey="count" fill="url(#barGradient)" radius={[8, 8, 0, 0]} maxBarSize={60} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Quiz Performance */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-base sm:text-lg font-semibold">Quiz Performance Trend</h3>
            <p className="text-xs text-slate-500 mt-0.5">Weekly average score</p>
          </div>
          <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded-lg">
            {scoreTrend.length} weeks
          </span>
        </div>

        {scoreTrend.length === 0 ? (
          <div className="h-48 flex items-center justify-center">
            <p className="text-slate-500 text-sm">No quiz performance data.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={scoreTrend}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1e293b" strokeDasharray="4 4" vertical={false} />
              <XAxis
                dataKey="week"
                stroke="#475569"
                tick={{ fontSize: 11, fill: "#64748b" }}
                tickFormatter={formatWeekLabel}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                stroke="#475569"
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                width={28}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#334155", strokeWidth: 1 }} />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#22c55e"
                strokeWidth={2.5}
                fill="url(#scoreGradient)"
                dot={{ r: 4, fill: "#22c55e", strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#22c55e", strokeWidth: 2, stroke: "#fff" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}