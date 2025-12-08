import React, { useState, useRef, useEffect, useContext } from "react";
import { chat } from "@/services/assistant";
import { UserContext } from "@/context/UserContext";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "katex/dist/katex.min.css";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

const ChatAI = ({ problem, currentProblemId, setCurrentProblemId }) => {
    const { user } = useContext(UserContext);
    const [messages, setMessages] = useState([]); 
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const bottomRef = useRef(null);

    const scrollToBottom = () => {
        setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 50);
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    useEffect(() => {
        setCurrentProblemId(null);
        }, [problem]);

    const send = async () => {
        if (!input.trim() || loading) return;

        // add user message
        const userMsg = { from: user?.username, text: input };
        setMessages((prev) => [...prev, userMsg]);
        scrollToBottom();

        const userInput = input;
        setInput("");
        setLoading(true);

        try {
            const res = await chat(currentProblemId, problem, userInput);

        if (res?.problemId) setCurrentProblemId(res.problemId);

            const botMsg = { from: "bot", text: res.response.content };
            setMessages((prev) => [...prev, botMsg]);
        } catch (err) {
            const errMsg = { from: "bot", text: "❌ Error: could not get response." };
            setMessages((prev) => [...prev, errMsg]);
        }

        setLoading(false);
        scrollToBottom();
    };

    const handleKey = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        send();
        }
    };

    return (
        <div className="flex flex-col h-80 w-full mx-auto border rounded-xl shadow-lg bg-white">
        {/* Chat area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`max-w-[80%] p-3 rounded-lg prose prose-sm ${
                            msg.from === "bot"
                            ? "bg-gray-200 text-gray-900 self-start"
                            : "bg-blue-500 text-white self-end ml-auto"
                        }`}
                        >
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                        >
                            {msg.text}
                        </ReactMarkdown>
                    </div>

                    )
                )
            }

            {loading && (
            <div className="self-start bg-gray-200 text-gray-600 px-3 py-2 rounded-lg animate-pulse">
                Thinking...
            </div>
            )}

            <div ref={bottomRef}></div>
        </div>

        {/* Textbox */}
        <div className="p-3 border-t flex gap-2">
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask Anything about question..."
                className="flex-1 p-2 border rounded-lg resize-none focus:outline-none focus:ring focus:ring-blue-300"
                rows={1}
            />

            <button
                onClick={send}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
                Send
            </button>
        </div>
        </div>
    );
};

export default ChatAI;
