import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../../../api/axios";
import { Send, Trash2, Bot, User } from "lucide-react";
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

    const userMessage = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);

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
      setInput("");
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
    <div className="flex flex-col h-[65vh] sm:h-[70vh]">

      {/* Header */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">

        <h2 className="text-xl sm:text-2xl font-semibold text-white">
          Ask AI
        </h2>

        <button
          onClick={clearChat}
          className="flex items-center justify-center sm:justify-start gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 px-3 py-2 rounded-lg text-sm transition w-full sm:w-auto"
        >
          <Trash2 size={16} />
          Clear
        </button>

      </div>

      {/* Chat messages */}

      <div className="flex-1 overflow-y-auto bg-black/40 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-5">

        {messages.length === 0 && (
          <div className="text-center text-slate-500 mt-16">
            Ask questions about this document
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >

            {msg.role === "assistant" && (
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 border border-slate-700 shrink-0">
                <Bot size={16} />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-900 border border-slate-800 text-slate-300"
              }`}
            >
              {msg.role === "assistant" ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => (
                      <p className="mb-2 leading-relaxed">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc ml-5 space-y-1">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal ml-5 space-y-1">{children}</ol>
                    ),
                    strong: ({ children }) => (
                      <strong className="text-white font-semibold">
                        {children}
                      </strong>
                    ),
                    h1: ({ children }) => (
                      <h1 className="text-lg font-semibold text-white mb-2">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-md font-semibold text-white mb-2">
                        {children}
                      </h2>
                    ),
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              ) : (
                msg.content
              )}
            </div>

            {msg.role === "user" && (
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 shrink-0">
                <User size={16} />
              </div>
            )}

          </div>
        ))}

        {loading && (
          <div className="text-slate-400 text-sm">
            AI is thinking...
          </div>
        )}

        <div ref={bottomRef} />

      </div>

      {/* Input */}

      <div className="flex gap-2 sm:gap-3 mt-4">

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          placeholder="Ask about this document..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-700 px-4 rounded-xl flex items-center justify-center"
        >
          <Send size={18} />
        </button>

      </div>

    </div>
  );
}