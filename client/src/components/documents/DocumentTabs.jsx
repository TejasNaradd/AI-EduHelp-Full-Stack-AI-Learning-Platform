import { NavLink, Routes, Route, Navigate, useParams } from "react-router-dom";
import { FileText, FileTextIcon, MessageSquare, Brain, Layers, MoreHorizontal } from "lucide-react";
import { useState } from "react";

import ContentTab from "./tabs/ContentTab";
import SummaryTab from "./tabs/SummaryTab";
import ChatTab from "./tabs/ChatTab";
import QuizTab from "./tabs/QuizTab";
import FlashcardsTab from "./tabs/FlashcardsTab";

export default function DocumentTabs() {
  const { docId } = useParams();
  const [openMenu, setOpenMenu] = useState(false);

  const base =
    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition whitespace-nowrap";

  const active =
    "bg-slate-800 text-white shadow";

  const inactive =
    "text-slate-400 hover:text-white hover:bg-slate-900";

  const dropdownBase =
    "flex items-center gap-2 px-4 py-2 text-sm";

  const dropdownActive =
    "bg-slate-800 text-white";

  const dropdownInactive =
    "text-slate-300 hover:bg-slate-800";

  return (
    <div className="space-y-6">

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3 relative">

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

        {/* Desktop tabs */}
        <div className="hidden md:flex gap-3">

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

        {/* Mobile menu */}
        <div className="md:hidden ml-auto relative">

          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="p-2 rounded-lg hover:bg-slate-800"
          >
            <MoreHorizontal size={20} />
          </button>

          {openMenu && (
            <div className="absolute right-0 mt-2 w-44 bg-slate-900 border border-slate-700 rounded-lg shadow-lg z-20">

              <NavLink
                to={`/documents/${docId}/chat`}
                onClick={() => setOpenMenu(false)}
                className={({ isActive }) =>
                  `${dropdownBase} ${isActive ? dropdownActive : dropdownInactive}`
                }
              >
                <MessageSquare size={16} />
                Chat
              </NavLink>

              <NavLink
                to={`/documents/${docId}/quiz`}
                onClick={() => setOpenMenu(false)}
                className={({ isActive }) =>
                  `${dropdownBase} ${isActive ? dropdownActive : dropdownInactive}`
                }
              >
                <Brain size={16} />
                Quiz
              </NavLink>

              <NavLink
                to={`/documents/${docId}/flashcards`}
                onClick={() => setOpenMenu(false)}
                className={({ isActive }) =>
                  `${dropdownBase} ${isActive ? dropdownActive : dropdownInactive}`
                }
              >
                <Layers size={16} />
                Flashcards
              </NavLink>

            </div>
          )}

        </div>

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