import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import api from "../../../api/axios";
import { Copy, RefreshCw, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

export default function SummaryTab() {
  const { docId } = useParams();

  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchSummary();
  }, [docId]);

  const fetchSummary = async () => {
    try {
      const res = await api.get(`/documents/${docId}`);
      setSummary(res.data.data.summary || "");
    } catch (err) {
      console.error("Summary fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const generateSummary = async () => {
    try {
      setGenerating(true);
      const res = await api.post(`/documents/${docId}/summary`);
      setSummary(res.data.data.summary);
      toast.success("Summary generated");
    } catch (err) {
      toast.error("Failed to generate summary");
    } finally {
      setGenerating(false);
    }
  };

  const copySummary = () => {
    navigator.clipboard.writeText(summary);
    toast.success("Summary copied");
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-400 text-sm py-10 justify-center">
        <RefreshCw size={16} className="animate-spin" />
        Loading summary...
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-5 text-center">
        <div className="bg-slate-800/60 p-5 rounded-full">
          <Sparkles size={36} className="text-blue-400" />
        </div>
        <div className="space-y-1">
          <p className="text-white font-medium">No summary yet</p>
          <p className="text-slate-400 text-sm">Generate a summary for this document</p>
        </div>
        <button
          onClick={generateSummary}
          disabled={generating}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-6 py-2.5 rounded-lg text-white text-sm font-medium transition"
        >
          {generating ? "Generating..." : "Generate Summary"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-wide">
          Document Summary
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={copySummary}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 rounded-lg text-slate-300 text-sm transition"
          >
            <Copy size={14} />
            Copy
          </button>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-7 backdrop-blur-sm">
        <div className="summary-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold text-white mt-0 mb-4 pb-2 border-b border-slate-700">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-lg font-semibold text-blue-400 mt-7 mb-3 flex items-center gap-2">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-base font-semibold text-slate-200 mt-5 mb-2">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-slate-300 leading-7 mb-4 text-sm sm:text-base">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="space-y-1.5 mb-4 pl-1">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="space-y-1.5 mb-4 pl-5 list-decimal">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-slate-300 text-sm sm:text-base flex gap-2 items-start">
                  <span className="text-blue-400 mt-1.5 shrink-0">▸</span>
                  <span>{children}</span>
                </li>
              ),
              strong: ({ children }) => (
                <strong className="text-white font-semibold">{children}</strong>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-2 border-blue-500 pl-4 py-1 my-4 bg-blue-500/5 rounded-r-lg text-slate-400 italic text-sm">
                  {children}
                </blockquote>
              ),
              code: ({ inline, children }) =>
                inline ? (
                  <code className="text-blue-300 bg-slate-800 px-1.5 py-0.5 rounded text-sm font-mono">
                    {children}
                  </code>
                ) : (
                  <pre className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 overflow-x-auto my-4">
                    <code className="text-slate-200 text-sm font-mono">{children}</code>
                  </pre>
                ),
              table: ({ children }) => (
                <div className="overflow-x-auto my-5 rounded-xl border border-slate-700">
                  <table className="w-full text-sm">{children}</table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-slate-800 text-slate-300">{children}</thead>
              ),
              th: ({ children }) => (
                <th className="px-4 py-3 text-left font-semibold text-slate-200 text-xs uppercase tracking-wider border-b border-slate-700">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-4 py-3 text-slate-300 border-b border-slate-800/60">
                  {children}
                </td>
              ),
              tr: ({ children }) => (
                <tr className="hover:bg-slate-800/40 transition-colors">{children}</tr>
              ),
              hr: () => <hr className="border-slate-700/60 my-6" />,
              input: ({ type, checked }) =>
                type === "checkbox" ? (
                  <input
                    type="checkbox"
                    checked={checked}
                    readOnly
                    className="mr-2 mt-0.5 accent-blue-500 rounded"
                  />
                ) : null,
            }}
          >
            {summary}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}