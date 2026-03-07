import DocumentCard from "./DocumentCard";

export default function DocumentGrid({ documents, refresh }) {
  if (!documents.length)
    return (
      <div className="text-slate-400 mt-10">
        No documents uploaded yet.
      </div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 pb-12">
      {documents.map((doc) => (
        <DocumentCard
          key={doc._id}
          doc={doc}
          refresh={refresh}
        />
      ))}
    </div>
  );
}