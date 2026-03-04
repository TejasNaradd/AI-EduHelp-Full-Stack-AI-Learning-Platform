import { useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

export default function UploadModal({ isOpen, onClose, refresh }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!file) {
      toast.error("Please select a PDF file");
      return;
    }

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("pdf-file", file); // MUST match multer

    try {
      setLoading(true);

      await api.post("/documents", formData);

      toast.success("Document uploaded successfully");

      refresh();
      onClose();

      setTitle("");
      setDescription("");
      setFile(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-slate-900 w-full max-w-md rounded-2xl p-6 border border-slate-700">
        
        <h2 className="text-xl font-semibold text-white mb-4">
          Upload Document
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Title */}
          <div>
            <label className="text-sm text-slate-300">Title *</label>
            <input
              type="text"
              className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter document title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-slate-300">
              Description (optional)
            </label>
            <textarea
              rows="3"
              className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-blue-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add description..."
            />
          </div>

          {/* File */}
          <div>
            <label className="text-sm text-slate-300">PDF File *</label>
            <input
              type="file"
              accept="application/pdf"
              className="w-full mt-1 text-sm text-slate-400"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}