import { useState, useEffect } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

export default function EditDocumentModal({
  isOpen,
  onClose,
  document,
  refresh
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (document) {
      setTitle(document.title || "");
      setDescription(document.description || "");
    }
  }, [document]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.patch(`/documents/${document._id}`, {
        title,
        description
      });

      toast.success("Document updated");
      refresh();
      onClose();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">

      <div className="bg-slate-900 p-5 sm:p-6 rounded-xl w-full max-w-md border border-slate-700">

        <h2 className="text-lg font-semibold text-white mb-4">
          Edit Document
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="text-sm text-slate-400">
              Title
            </label>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 p-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
              required
            />
          </div>

          <div>
            <label className="text-sm text-slate-400">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 p-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
              rows="3"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-700 rounded-lg text-white w-full sm:w-auto"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 rounded-lg text-white w-full sm:w-auto"
            >
              Save Changes
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}