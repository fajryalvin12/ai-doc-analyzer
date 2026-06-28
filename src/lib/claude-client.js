import Anthropic from "@anthropic-ai/sdk";
import { chunkText } from "./pdf-extractor";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function summarizeDocument(text) {
  const chunks = chunkText(text);
  const contentToSummarize = chunks[0];

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system:
      "You are a document analyzer assistant. Summarize the document provided by the user in Bahasa Indonesia. Extract the key points in bullet format.",
    messages: [
      {
        role: "user",
        content: `Berikut isi dokumen yang perlu dianalisa:\n\n${contentToSummarize}`,
      },
    ],
  });

  let result = "";
  for await (const chunk of stream) {
    if (chunk.type === "content_block_delta") {
      result += chunk.delta?.text || "";
    }
  }

  return result;
}

export async function answerQuestion(text, question) {
  const chunks = chunkText(text);
  const context = chunks[0];

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system:
      "You are a document assistant. Answer the user's question based ONLY on the document provided. If the answer is not in the document, say so. Answer in Bahasa Indonesia.",
    messages: [
      {
        role: "user",
        content: `Dokumen:\n\n${context}\n\nPertanyaan: ${question}`,
      },
    ],
  });

  let result = "";
  for await (const chunk of stream) {
    if (chunk.type === "content_block_delta") {
      result += chunk.delta?.text || "";
    }
  }

  return result;
}
