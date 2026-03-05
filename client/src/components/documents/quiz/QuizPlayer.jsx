import { useEffect,useState } from "react";
import api from "../../../api/axios";
import toast from "react-hot-toast";
import QuizResult from "./QuizResult";

export default function QuizPlayer({quizId,goBack}) {

  const [quiz,setQuiz] = useState(null);
  const [questions,setQuestions] = useState([]);
  const [current,setCurrent] = useState(0);
  const [answers,setAnswers] = useState([]);
  const [result,setResult] = useState(null);

  useEffect(()=>{

    const fetchQuiz = async()=>{

      try{

        const res = await api.get(`/quiz/${quizId}`);

        setQuiz(res.data.data.quiz);
        setQuestions(res.data.data.questions);

      }catch(err){
        toast.error("Failed to load quiz");
      }
    };

    fetchQuiz();

  },[]);

  const selectOption = (index)=>{

    const qId = questions[current]._id;

    const updated = answers.filter(a=>a.questionId!==qId);

    updated.push({
      questionId:qId,
      selectedIndex:index
    });

    setAnswers(updated);
  };

  const submitQuiz = async()=>{

    try{

      const res = await api.post(`/quiz/${quizId}/submit`,{
        answers
      });

      setResult(res.data.data);

    }catch(err){
      toast.error("Submission failed");
    }

  };

  if(result){
    return <QuizResult result={result} goBack={goBack}/>;
  }

  if(!questions.length){
    return <p className="text-gray-400">Loading quiz...</p>;
  }

  const q = questions[current];

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      <button
        onClick={goBack}
        className="text-sm text-gray-400"
      >
        ← Back
      </button>

      <h2 className="text-xl font-semibold">
        {quiz.title}
      </h2>

      <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">

        <p className="mb-4 font-medium">
          Q{current+1}. {q.question}
        </p>

        <div className="space-y-3">

          {q.options.map((opt,i)=>{

            const selected =
              answers.find(a=>a.questionId===q._id)?.selectedIndex === i;

            return(
              <button
                key={i}
                onClick={()=>selectOption(i)}
                className={`
                w-full text-left p-3 rounded-lg border
                ${selected
                  ? "bg-blue-600 border-blue-500"
                  : "border-slate-700 hover:bg-slate-800"
                }
                `}
              >
                {opt}
              </button>
            );
          })}

        </div>

      </div>

      <div className="flex justify-between">

        <button
          disabled={current===0}
          onClick={()=>setCurrent(c=>c-1)}
          className="px-4 py-2 bg-slate-800 rounded"
        >
          Previous
        </button>

        {current === questions.length-1 ? (

          <button
            onClick={submitQuiz}
            className="px-6 py-2 bg-green-600 rounded"
          >
            Submit Quiz
          </button>

        ):(
          <button
            onClick={()=>setCurrent(c=>c+1)}
            className="px-4 py-2 bg-blue-600 rounded"
          >
            Next
          </button>
        )}

      </div>

    </div>
  );
}