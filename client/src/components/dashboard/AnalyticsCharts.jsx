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
  return `Week ${weekPart}, ${year}`;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  const [year, weekPart] = label.split("-W");
  const month = getMonthFromISOWeek(parseInt(year), parseInt(weekPart));

  return (
    <div className="bg-slate-900 border border-slate-700 px-4 py-3 rounded-xl shadow-xl">
      <p className="text-sm text-slate-400 mb-1">
        Week {weekPart} • {month} {year}
      </p>
      <p className="text-indigo-400 font-semibold text-lg">
        {payload[0].value}
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
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">
            Weekly Document Activity
          </h3>
          <span className="text-xs text-slate-400">
            Last Activity Trend
          </span>
        </div>

        {weeklyUploads.length === 0 ? (
          <p className="text-slate-500 text-sm">
            No upload data yet.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyUploads}>
              <CartesianGrid
                stroke="#1e293b"
                strokeDasharray="4 4"
              />
              <XAxis
                dataKey="week"
                stroke="#64748b"
                tick={{ fontSize: 12 }}
                tickFormatter={formatWeekLabel}
              />
              <YAxis
                stroke="#64748b"
                allowDecimals={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "transparent" }}
              />
              <Bar
                dataKey="count"
                fill="url(#barGradient)"
                radius={[10, 10, 0, 0]}
              />
              <defs>
                <linearGradient
                  id="barGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#6366f1"
                    stopOpacity={1}
                  />
                  <stop
                    offset="100%"
                    stopColor="#4f46e5"
                    stopOpacity={0.7}
                  />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Quiz Performance */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">
            Quiz Performance Trend
          </h3>
          <span className="text-xs text-slate-400">
            Weekly Average Score
          </span>
        </div>

        {scoreTrend.length === 0 ? (
          <p className="text-slate-500 text-sm">
            No quiz performance data.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={scoreTrend}>
              <defs>
                <linearGradient
                  id="scoreGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#22c55e"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="100%"
                    stopColor="#22c55e"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="#1e293b"
                strokeDasharray="4 4"
              />
              <XAxis
                dataKey="week"
                stroke="#64748b"
                tick={{ fontSize: 12 }}
                tickFormatter={formatWeekLabel}
              />
              <YAxis
                stroke="#64748b"
                domain={[0, 100]}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "#334155" }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#22c55e"
                strokeWidth={3}
                fill="url(#scoreGradient)"
                dot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

    </div>
  );
}