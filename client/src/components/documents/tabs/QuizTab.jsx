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
    return <QuizPlayer quizId={activeQuiz} goBack={()=>{
      setActiveQuiz(null); 
      fetchQuizzes()
    }} />;
  }

return (
  <div className="space-y-6 relative">

    {/* background glow */}
    <div className="flex justify-between items-center">

      <h2 className="text-2xl font-semibold flex items-center gap-2">
        <Brain size={22}/>
        Quizzes
      </h2>

      <button
        onClick={generateQuiz}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-lg text-white"
      >
        <Plus size={16}/>
        Generate Quiz
      </button>

    </div>

    {loading && <p className="text-gray-400">Loading quizzes...</p>}

    <div className="grid sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">

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