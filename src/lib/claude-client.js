import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function summarizeDocument(text) {
  const stream = await client.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    system:
      "You are a document analyzer assistant. Summarize the document provided by the user in Bahasa Indonesia. Extract the key points in bullet format.",
    messages: [
      {
        role: "user",
        content: `Berikut isi dokumen yang perlu dianalisa:\n\n${text}`,
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
