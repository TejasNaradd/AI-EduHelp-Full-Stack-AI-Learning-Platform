import {
  FileText,
  MoreVertical,
  Trash2,
  Edit,
  Brain,
  Layers
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";
import EditDocumentModal from "./EditDocumentModal";

export default function DocumentCard({ doc, refresh }) {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const formattedDate = new Date(doc.createdAt).toLocaleString("en-US", {
    month: "short",
    day: "numeric"
  });

  const formatRelativeTime = (date) => {
    if (!date) return "Never opened";

    const now = new Date();
    const past = new Date(date);

    const seconds = Math.floor((now - past) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Last opened just now";
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (days === 1) return "yesterday";
    if (days < 7) return `${days} days ago`;

    return past.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });
  };

  const lastAccessed = formatRelativeTime(doc.progress?.lastAccessed);

  const deleteDoc = async (e) => {
    e.stopPropagation();
    try {
      await api.delete(`/documents/${doc._id}`);
      toast.success("Document deleted");
      refresh();
    } catch {
      toast.error("Delete failed");
    }
  };

  const score = doc.progress?.overallScore
    ? Math.round(doc.progress.overallScore)
    : null;

  const weakTopics =
    doc.progress?.weakTopics?.slice(0, 2) || [];

  return (
    <>
      <div
        onClick={() => navigate(`/documents/${doc._id}`)}
        className="
        relative cursor-pointer
        rounded-3xl overflow-hidden
        bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800
        border border-slate-800
        shadow-lg
        hover:shadow-blue-500/40
        hover:-translate-y-1
        transition-all duration-300
        group
      "
      >
        {/* PDF Preview */}

        <div className="h-44 bg-slate-800 overflow-hidden relative rounded-t-3xl">
          {doc.file_url ? (
            <iframe
              src={`${doc.file_url}#toolbar=0&navpanes=0&scrollbar=0`}
              title="pdf-preview"
              className="w-full h-full pointer-events-none border-0"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              No Preview
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-900/70 to-transparent" />
        </div>

        {/* Content */}

        <div className="p-6 space-y-5">

          {/* Title + Menu */}

          <div className="flex justify-between items-start">

            <div className="flex-1">

              <h2 className="text-lg font-semibold text-white tracking-wide line-clamp-2">
                {doc.title || "Untitled Document"}
              </h2>

              <div className="flex items-center gap-6 mt-2 text-sm text-slate-400">

                <div className="flex items-center gap-1.5">
                  <FileText size={14} className="text-slate-500" />
                  <span>{formattedDate}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-slate-500"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>

                  <span>{lastAccessed}</span>

                </div>

              </div>

            </div>

            {/* Menu */}

            <div className="relative">

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenu(!openMenu);
                }}
                className="text-slate-400 hover:text-white transition"
              >
                <MoreVertical size={20} />
              </button>

              {openMenu && (
                <div className="absolute right-0 mt-2 w-36 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-20">

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditOpen(true);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-slate-700 rounded-t-xl"
                  >
                    <Edit size={14} /> Edit
                  </button>

                  <button
                    onClick={deleteDoc}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-slate-700 rounded-b-xl"
                  >
                    <Trash2 size={14} /> Delete
                  </button>

                </div>
              )}

            </div>

          </div>

          {/* Stats */}

          <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-sm">

            <div className="flex items-center gap-2 text-purple-400">
              <Brain size={16} />
              <span className="text-slate-300">
                {doc.quizCount || 0} Quizzes
              </span>
            </div>

            <div className="flex items-center gap-2 text-blue-400">
              <Layers size={16} />
              <span className="text-slate-300">
                {doc.flashcardSetCount || 0} Sets
              </span>
            </div>

          </div>

          {/* Progress */}

          {(score || weakTopics.length > 0) && (
            <div className="text-xs text-slate-400 space-y-1">

              {score && (
                <div>
                  Score:{" "}
                  <span className="text-green-400 font-medium">
                    {score}%
                  </span>
                </div>
              )}

              {weakTopics.length > 0 && (
                <div>
                  Weak:{" "}
                  <span className="text-red-400">
                    {weakTopics.map(t => t.name).join(", ")}
                  </span>
                </div>
              )}

            </div>
          )}

          {/* Status */}

          <div>
            <span
              className="
              text-xs 
              px-3 py-1 
              rounded-full 
              bg-green-500/10 
              text-green-400 
              border border-green-500/20
            "
            >
              Uploaded
            </span>
          </div>

        </div>

      </div>

      <EditDocumentModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        document={doc}
        refresh={refresh}
      />
    </>
  );
}