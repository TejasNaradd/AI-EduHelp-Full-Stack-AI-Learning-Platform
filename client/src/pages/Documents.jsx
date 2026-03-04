import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import api from "../api/axios";

import DocumentGrid from "../components/documents/DocumentGrid";
import DocumentTabs from "../components/documents/DocumentTabs";
import UploadModal from "../components/documents/UploadModal";

export default function Documents() {
  const { docId } = useParams();
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [filteredDocs, setFilteredDocs] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    if (!search) {
      setFilteredDocs(documents);
    } else {
      const filtered = documents.filter((doc) =>
        doc.title.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredDocs(filtered);
    }
  }, [search, documents]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);

      const res = await api.get("/documents");

      const docsArray = res.data?.data?.docs || [];

      const sorted = docsArray.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setDocuments(sorted);
      setFilteredDocs(sorted);
    } catch (error) {
      console.error("Fetch documents error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (docId) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate("/documents")}
          className="text-blue-400 hover:text-blue-300 transition"
        >
          ← Back to Documents
        </button>

        <DocumentTabs documentId={docId} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            My Documents
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Upload and manage your study materials
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-xl text-white transition"
        >
          + Upload
        </button>
      </div>

      {/* Search */}
      <div className="relative w-80">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search documents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full
            pl-10
            pr-4
            py-2.5
            rounded-xl
            bg-slate-900
            border border-slate-700
            text-white
            placeholder:text-slate-400
            focus:outline-none
            focus:border-blue-500
            transition
          "
        />
      </div>

      {/* Documents */}
      {loading ? (
        <div className="text-slate-400">Loading documents...</div>
      ) : (
        <DocumentGrid
          documents={filteredDocs}
          refresh={fetchDocuments}
        />
      )}

      {/* Upload Modal */}
      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        refresh={fetchDocuments}
      />
    </div>
  );
}