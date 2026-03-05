import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../../api/axios";
import { ExternalLink, Download } from "lucide-react";

export default function ContentTab() {
  const { docId } = useParams();

  const [doc, setDoc] = useState(null);

  useEffect(() => {
    loadDocument();
  }, [docId]);

  const loadDocument = async () => {
    try {
      const res = await api.get(`/documents/${docId}`);
      setDoc(res.data.data);
    } catch (error) {
      console.error("Document load error", error);
    }
  };

  if (!doc) {
    return (
      <div className="text-slate-400">
        Loading document...
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* Actions */}
      <div className="flex gap-3">

        <a
          href={doc.file_url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg text-sm hover:bg-slate-700 transition"
        >
          <ExternalLink size={16} />
          Open in new tab
        </a>

        <a
          href={doc.file_url}
          target="_blank"
          download
          className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg text-sm hover:bg-slate-700 transition"
        >
          <Download size={16} />
          Download
        </a>

      </div>

      {/* Viewer */}
      <div className="h-[78vh] border border-slate-800 rounded-xl overflow-hidden">

        <iframe
          src={`${doc.file_url}#toolbar=1`}
          title="document"
          className="w-full h-full"
        />

      </div>

    </div>
  );
}