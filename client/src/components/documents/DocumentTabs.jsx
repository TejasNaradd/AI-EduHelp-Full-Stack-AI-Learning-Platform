import { NavLink, Routes, Route, Navigate, useParams } from "react-router-dom";
import { FileText, FileTextIcon, MessageSquare, Brain, Layers } from "lucide-react";
import ContentTab from "./tabs/ContentTab";
import SummaryTab from "./tabs/SummaryTab";
import ChatTab from "./tabs/ChatTab";
import QuizTab from "./tabs/QuizTab";
import FlashcardsTab from "./tabs/FlashcardsTab";

export default function DocumentTabs() {
  const { docId } = useParams();

  const base =
    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition";

  const active =
    "bg-slate-800 text-white shadow";

  const inactive =
    "text-slate-400 hover:text-white hover:bg-slate-900";

  return (
    <div className="space-y-6">

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-800 pb-3">

        <NavLink
          to={`/documents/${docId}/content`}
          className={({ isActive }) =>
            `${base} ${isActive ? active : inactive}`
          }
        >
          <FileText size={16} />
          Content
        </NavLink>

        <NavLink
          to={`/documents/${docId}/summary`}
          className={({ isActive }) =>
            `${base} ${isActive ? active : inactive}`
          }
        >
          <FileTextIcon size={16} />
          Summary
        </NavLink>

        <NavLink
          to={`/documents/${docId}/chat`}
          className={({ isActive }) =>
            `${base} ${isActive ? active : inactive}`
          }
        >
          <MessageSquare size={16} />
          Chat
        </NavLink>

        <NavLink
          to={`/documents/${docId}/quiz`}
          className={({ isActive }) =>
            `${base} ${isActive ? active : inactive}`
          }
        >
          <Brain size={16} />
          Quiz
        </NavLink>

        <NavLink
          to={`/documents/${docId}/flashcards`}
          className={({ isActive }) =>
            `${base} ${isActive ? active : inactive}`
          }
        >
          <Layers size={16} />
          Flashcards
        </NavLink>

      </div>

      {/* Routes */}
        <Routes>
        <Route index element={<Navigate to="content" replace />} />
        <Route path="content" element={<ContentTab />} />
        <Route path="summary" element={<SummaryTab />} />
        <Route path="chat" element={<ChatTab />} />
        <Route path="quiz" element={<QuizTab />} />
        <Route path="flashcards/*" element={<FlashcardsTab />} />
        </Routes>

    </div>
  );
}