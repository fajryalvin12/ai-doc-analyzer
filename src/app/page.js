"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [file, setFile] = useState(null);
  const [fileId, setFileId] = useState(null);
  const [summary, setSummary] = useState("");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isAsking, setIsAsking] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setSummary("");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/extract", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setFileId(data.fileId);
    setSummary(data.summary);
    setIsUploading(false);
  };

  const handleAsk = async () => {
    if (!question || !fileId) return;
    setIsAsking(true);

    const userMessage = { role: "user", content: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileId, question }),
    });

    const data = await res.json();
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: data.answer },
    ]);
    setIsAsking(false);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-4">
        <h1 className="text-lg font-semibold tracking-tight">
          AI Document Analyzer
        </h1>
        <p className="text-sm text-white/40 mt-0.5">
          Upload PDF, get instant summary and ask anything
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 flex flex-col gap-10">
        {/* Upload Section */}
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-medium text-white/60 uppercase tracking-widest">
            Upload Document
          </h2>
          <div
            className="border border-dashed border-white/20 rounded-xl p-10 text-center cursor-pointer hover:border-white/40 hover:bg-white/5 transition-all"
            onClick={() => document.getElementById("fileInput").click()}
          >
            {file ? (
              <p className="text-sm text-white/80">{file.name}</p>
            ) : (
              <>
                <p className="text-white/40 text-sm">Click or drag PDF here</p>
              </>
            )}
            <input
              id="fileInput"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="w-full py-2.5 rounded-lg bg-white text-black text-sm font-medium hover:bg-white/90 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isUploading ? "Analyzing..." : "Analyze Document"}
          </button>
        </section>

        {/* Summary Section */}
        {summary && (
          <section className="flex flex-col gap-4">
            <h2 className="text-sm font-medium text-white/60 uppercase tracking-widest">
              Summary
            </h2>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 prose prose-invert prose-sm max-w-none">
              <ReactMarkdown>{summary}</ReactMarkdown>
            </div>
          </section>
        )}

        {/* Chat Section */}
        {fileId && (
          <section className="flex flex-col gap-4">
            <h2 className="text-sm font-medium text-white/60 uppercase tracking-widest">
              Ask Anything
            </h2>

            {/* Messages */}
            {messages.length > 0 && (
              <div className="flex flex-col gap-4">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${
                        msg.role === "user"
                          ? "bg-white text-black"
                          : "bg-white/5 border border-white/10 prose prose-invert prose-sm"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      ) : (
                        msg.content
                      )}
                    </div>
                  </div>
                ))}
                {isAsking && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/40">
                      Thinking...
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                placeholder="Ask something about the document..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition"
              />
              <button
                onClick={handleAsk}
                disabled={!question || isAsking}
                className="px-4 py-2.5 rounded-lg bg-white text-black text-sm font-medium hover:bg-white/90 transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Ask
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
