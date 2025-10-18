// app/components/Chatbot.tsx (MUKAMMAL FINAL RE-DESIGNED CODE)

"use client";

import { useState, useRef, useEffect } from "react";
import { sendMessageToBot } from "@/app/actionschat/chatActions";
import { MessageSquare, Send, X } from "lucide-react"; // Naye, behtar icons

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const botResponse = await sendMessageToBot([...messages, userMessage]);
      setMessages((prev) => [...prev, { role: "assistant", content: botResponse }]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I'm having trouble connecting. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Main container ab relative hai
    <div className="relative">
      {/* Chat Bubble Button - Ab iski positioning parent (RightDock) control karega */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 w-12 flex items-center justify-center rounded-lg bg-brand-accent text-white shadow-lg transition-transform transform hover:scale-110"
        aria-label="Toggle chatbot"
      >
        <MessageSquare size={24} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        // Positioning ab absolute hai, RightDock ke hisaab se
        <div className="absolute bottom-full right-0 mb-4 w-80 md:w-96 h-[60vh] bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="bg-brand-secondary text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-bold text-lg">PocketValue Assistant</h3>
            <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-white/20">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`my-2 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-2 rounded-lg shadow-sm ${
                    msg.role === "user"
                      ? "bg-brand-primary text-white rounded-br-none"
                      : "bg-gray-200 dark:bg-gray-700 text-text-primary dark:text-gray-200 rounded-bl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="my-2 flex justify-start">
                <div className="bg-gray-200 dark:bg-gray-700 text-black px-4 py-2 rounded-lg">
                  <span className="animate-pulse">...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
            <form onSubmit={handleSendMessage} className="flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-primary bg-gray-50 dark:bg-gray-700 text-text-primary dark:text-gray-200"
                placeholder="Ask me anything..."
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-brand-accent text-white px-4 rounded-r-md hover:bg-brand-primary-hover disabled:bg-orange-300 flex items-center justify-center"
                disabled={isLoading}
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}