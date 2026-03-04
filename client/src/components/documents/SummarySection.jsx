export default function SummarySection({ document }) {
  return (
    <div>

      <h2 className="text-xl font-semibold mb-4">
        AI Generated Summary
      </h2>

      <p className="text-gray-400 mb-6">
        Quick summary generated using AI from your document.
      </p>

      <div className="space-y-4">

        {document?.summary?.length ? (
          document.summary.map((point, index) => (
            <div
              key={index}
              className="bg-[#020617] border border-gray-800 rounded-lg p-4"
            >
              {point}
            </div>
          ))
        ) : (
          <p className="text-gray-400">No summary generated yet.</p>
        )}

      </div>

    </div>
  );
}