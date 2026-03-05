export default function QuizResult({result,goBack}){

  return(

    <div className="max-w-xl mx-auto text-center space-y-6">

      <h2 className="text-2xl font-semibold">
        Quiz Result
      </h2>

      <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">

        <p className="text-4xl font-bold text-green-400">
          {result.score}%
        </p>

        <p className="text-gray-400 mt-2">
          {result.correctAnswers} / {result.totalQuestions} correct
        </p>

      </div>

      {result.weakTopics.length>0 &&(

        <div className="text-left">

          <h3 className="font-semibold mb-2">
            Weak Topics
          </h3>

          <ul className="list-disc ml-6 text-gray-400">

            {result.weakTopics.map((t,i)=>(
              <li key={i}>{t}</li>
            ))}

          </ul>

        </div>

      )}

      <button
        onClick={goBack}
        className="px-5 py-2 bg-blue-600 rounded"
      >
        Back to Quizzes
      </button>

    </div>
  );
}

