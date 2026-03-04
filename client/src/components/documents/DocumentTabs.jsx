import { useState } from "react";
import {
  FileText,
  ScrollText,
  MessageSquare,
  Brain,
  Layers
} from "lucide-react";

import DocumentContent from "./DocumentContent";
import SummarySection from "./SummarySection";
import ChatSection from "./ChatSection";
import QuizSection from "./QuizSection";
import FlashcardSection from "./FlashcardSection";

export default function DocumentTabs({ document }) {
  const [activeTab, setActiveTab] = useState("content");

const tabs = [
  { id: "content", label: "Content", icon: FileText },
  { id: "summary", label: "Summary", icon: ScrollText },
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "quiz", label: "Quiz", icon: Brain },
  { id: "flashcards", label: "Flashcards", icon: Layers }
];

  const renderTab = () => {
    switch (activeTab) {
      case "content":
        return <DocumentContent document={document} />;
      case "summary":
        return <SummarySection document={document} />;
      case "chat":
        return <ChatSection document={document} />;
      case "quiz":
        return <QuizSection document={document} />;
      case "flashcards":
        return <FlashcardsSection document={document} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full mt-6">

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-800 pb-3">

        {tabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition
              
              ${activeTab === tab.id
                ? "bg-[#0f172a] text-blue-400"
                : "text-gray-400 hover:text-white hover:bg-[#0f172a]"}
              `}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="mt-6 bg-[#0f172a] border border-gray-800 rounded-xl p-6 min-h-[520px]">
        {renderTab()}
      </div>
    </div>
  );
}