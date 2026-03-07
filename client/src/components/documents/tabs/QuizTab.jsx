import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../api/axios";
import QuizCard from "../quiz/QuizCard";
import QuizPlayer from "../quiz/QuizPlayer";
import { Brain, Plus } from "lucide-react";
import toast from "react-hot-toast";

export default function QuizTab() {

  const { docId } = useParams();

  const [quizzes,setQuizzes] = useState([]);
  const [loading,setLoading] = useState(true);
  const [activeQuiz,setActiveQuiz] = useState(null);

  const fetchQuizzes = async () => {
    try {

      const res = await api.get(`/documents/${docId}/quiz`);
      setQuizzes(res.data.data);

    } catch (err) {

      toast.error("Failed to fetch quizzes");

    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    fetchQuizzes();
  },[]);

  const generateQuiz = async () => {

    try {

      toast.loading("Generating quiz...");

      await api.post(`/documents/${docId}/quiz`);

      toast.dismiss();
      toast.success("Quiz generated");

      fetchQuizzes();

    } catch (err) {

      toast.dismiss();
      toast.error("Quiz generation failed");

    }
  };

  if(activeQuiz){
    return (
      <QuizPlayer
        quizId={activeQuiz}
        goBack={()=>{
          setActiveQuiz(null);
          fetchQuizzes();
        }}
      />
    );
  }

return (
  <div className="space-y-6 relative">

    {/* Header */}

    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

      <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
        <Brain size={22}/>
        Quizzes
      </h2>

      <button
        onClick={generateQuiz}
        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-lg text-white w-full sm:w-auto"
      >
        <Plus size={16}/>
        Generate Quiz
      </button>

    </div>

    {/* Loading */}

    {loading && (
      <p className="text-gray-400 text-sm">
        Loading quizzes...
      </p>
    )}

    {/* Quiz Grid */}

    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">

      {quizzes.map((quiz)=>(
        <QuizCard
          key={quiz._id}
          quiz={quiz}
          openQuiz={()=>setActiveQuiz(quiz._id)}
        />
      ))}

    </div>

  </div>
);
}