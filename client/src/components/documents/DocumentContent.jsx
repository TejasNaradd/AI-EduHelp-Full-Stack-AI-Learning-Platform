export default function DocumentContent({ document }) {
  return (
    <div>

      <h2 className="text-xl font-semibold mb-4">
        Document Content
      </h2>

      <p className="text-gray-400 mb-6">
        View the full content of your uploaded document.
      </p>

      <div className="bg-[#020617] border border-gray-800 rounded-lg p-6 text-gray-300 min-h-[380px]">

        {/* PDF Viewer Later */}
        Document preview will appear here.

      </div>

    </div>
  );
}