import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../../../api/axios";
import { Send, Trash2, Bot, User, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatTab() {
  const { docId } = useParams();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    loadChat();
  }, [docId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadChat = async () => {
    try {
      const res = await api.get(`/documents/${docId}/chat`);
      const msgs = res.data?.data?.messages || [];
      setMessages(msgs);
    } catch (err) {
      console.error("Chat load error", err);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      setLoading(true);
      const res = await api.post(`/documents/${docId}/chat`, {
        message: input,
      });
      const aiMessage = {
        role: "assistant",
        content: res.data.data.reply,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      toast.error("AI response failed");
    } finally {
      setLoading(false);
    }
  };

  const clearChat = async () => {
    try {
      await api.delete(`/documents/${docId}/chat`);
      setMessages([]);
      toast.success("Chat cleared");
    } catch {
      toast.error("Failed to clear chat");
    }
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-160px)] sm:h-[75vh] max-w-4xl mx-auto w-full">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-3 sm:mb-4 px-1">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-blue-400" />
          <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
            Ask AI
          </h2>
        </div>

        <button
          onClick={clearChat}
          className="flex items-center gap-1.5 bg-slate-900 hover:bg-red-900/40 border border-slate-700 hover:border-red-700/60 text-slate-400 hover:text-red-400 px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-all duration-200"
        >
          <Trash2 size={13} />
          <span>Clear</span>
        </button>
      </div>

      {/* ── Chat Messages ── */}
      <div className="flex-1 overflow-y-auto bg-black/40 border border-slate-800 rounded-2xl p-3 sm:p-5 space-y-4 scroll-smooth">

        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-500">
            <Bot size={36} className="text-slate-700" />
            <p className="text-sm sm:text-base text-center">
              Ask questions about this document
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2 sm:gap-3 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {/* AI Avatar */}
            {msg.role === "assistant" && (
              <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-blue-600/20 border border-blue-500/30 shrink-0 mt-1">
                <Bot size={14} className="text-blue-400" />
              </div>
            )}

            {/* Message Bubble */}
            <div
              className={`
                max-w-[90%] sm:max-w-[78%] rounded-2xl text-sm leading-relaxed
                ${msg.role === "user"
                  ? "bg-blue-600 text-white px-4 py-2.5 rounded-tr-sm"
                  : "bg-slate-900 border border-slate-700/80 text-slate-200 px-4 py-3 rounded-tl-sm w-full"
                }
              `}
            >
              {msg.role === "assistant" ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    /* Paragraphs */
                    p: ({ children }) => (
                      <p className="mb-3 last:mb-0 leading-7 text-slate-200">
                        {children}
                      </p>
                    ),

                    /* Headings */
                    h1: ({ children }) => (
                      <h1 className="text-base sm:text-lg font-bold text-white mb-2 mt-3 first:mt-0 pb-1 border-b border-slate-700">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-sm sm:text-base font-semibold text-white mb-2 mt-3 first:mt-0">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-sm font-semibold text-blue-300 mb-1.5 mt-2.5 first:mt-0">
                        {children}
                      </h3>
                    ),

                    /* Unordered list */
                    ul: ({ children }) => (
                      <ul className="my-2 space-y-1.5 ml-1">
                        {children}
                      </ul>
                    ),
                    /* Ordered list */
                    ol: ({ children }) => (
                      <ol className="my-2 space-y-1.5 ml-1 list-none counter-reset-[item]">
                        {children}
                      </ol>
                    ),
                    /* List items — custom bullet / number styling */
                    li: ({ children, ordered, index }) => (
                      <li className="flex gap-2 items-start text-slate-300">
                        <span className="mt-[3px] shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-blue-600/20 text-blue-400 text-[10px] font-bold border border-blue-500/20">
                          {typeof index === "number" ? index + 1 : "•"}
                        </span>
                        <span className="leading-6">{children}</span>
                      </li>
                    ),

                    /* Inline code */
                    code: ({ inline, children }) =>
                      inline ? (
                        <code className="bg-slate-800 text-blue-300 px-1.5 py-0.5 rounded text-[12px] font-mono border border-slate-700">
                          {children}
                        </code>
                      ) : (
                        <code className="block bg-slate-950 text-green-300 p-3 rounded-lg text-[12px] font-mono border border-slate-700 overflow-x-auto my-2">
                          {children}
                        </code>
                      ),

                    /* Code block wrapper */
                    pre: ({ children }) => (
                      <pre className="bg-slate-950 border border-slate-700 rounded-xl overflow-x-auto my-3 p-3">
                        {children}
                      </pre>
                    ),

                    /* Blockquote */
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-2 border-blue-500 pl-3 my-2 text-slate-400 italic">
                        {children}
                      </blockquote>
                    ),

                    /* Bold */
                    strong: ({ children }) => (
                      <strong className="text-white font-semibold">
                        {children}
                      </strong>
                    ),

                    /* Italic */
                    em: ({ children }) => (
                      <em className="text-slate-300 italic">{children}</em>
                    ),

                    /* Horizontal rule */
                    hr: () => (
                      <hr className="border-slate-700 my-3" />
                    ),

                    /* Table */
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-3 rounded-lg border border-slate-700">
                        <table className="w-full text-xs sm:text-sm">
                          {children}
                        </table>
                      </div>
                    ),
                    thead: ({ children }) => (
                      <thead className="bg-slate-800 text-slate-200">
                        {children}
                      </thead>
                    ),
                    tbody: ({ children }) => (
                      <tbody className="divide-y divide-slate-800">
                        {children}
                      </tbody>
                    ),
                    tr: ({ children }) => <tr>{children}</tr>,
                    th: ({ children }) => (
                      <th className="px-3 py-2 text-left font-semibold">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="px-3 py-2 text-slate-300">{children}</td>
                    ),
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              ) : (
                <span>{msg.content}</span>
              )}
            </div>

            {/* User Avatar */}
            {msg.role === "user" && (
              <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-blue-600 shrink-0 mt-1">
                <User size={14} />
              </div>
            )}
          </div>
        ))}

        {/* Thinking indicator */}
        {loading && (
          <div className="flex gap-2 sm:gap-3 justify-start">
            <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-blue-600/20 border border-blue-500/30 shrink-0 mt-1">
              <Bot size={14} className="text-blue-400" />
            </div>
            <div className="bg-slate-900 border border-slate-700/80 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input Bar ── */}
      <div className="flex gap-2 mt-3 sm:mt-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Ask about this document…"
          className="flex-1 bg-slate-900 border border-slate-700 hover:border-slate-600 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors duration-200"
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed px-4 sm:px-5 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-95"
        >
          <Send size={16} />
        </button>
      </div>

    </div>
  );
}