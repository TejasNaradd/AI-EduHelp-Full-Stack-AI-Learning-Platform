import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import api from "../../../api/axios";
import { Copy, Sparkles } from "lucide-react";
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
      <div className="text-slate-400 text-sm">
        Loading summary...
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6">

        <Sparkles size={40} className="text-slate-500" />

        <p className="text-slate-400 text-sm">
          No summary generated yet
        </p>

        <button
          onClick={generateSummary}
          disabled={generating}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-white text-sm transition"
        >
          {generating ? "Generating..." : "Generate Summary"}
        </button>

      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">

        <h2 className="text-2xl font-semibold text-white tracking-wide">
          Document Summary
        </h2>

        <button
          onClick={copySummary}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 px-3 py-2 rounded-lg text-sm transition"
        >
          <Copy size={16} />
          Copy
        </button>

      </div>

      {/* Summary Card */}
      <div className="bg-black/40 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm shadow-[0_0_20px_rgba(255,255,255,0.03)]">

        <div
          className="
          prose
          prose-invert
          max-w-none

          prose-headings:text-white
          prose-headings:font-semibold

          prose-h2:text-xl
          prose-h3:text-lg

          prose-p:text-slate-300
          prose-p:leading-relaxed

          prose-strong:text-white

          prose-ul:pl-5
          prose-li:text-slate-300
          prose-li:marker:text-slate-400

          prose-code:text-white
          prose-code:bg-slate-900
          prose-code:px-1
          prose-code:rounded
          "
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {summary}
          </ReactMarkdown>
        </div>

      </div>

    </div>
  );
}