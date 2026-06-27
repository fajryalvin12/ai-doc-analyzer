import { summarizeDocument } from "@/lib/claude-client";
import { extractPdfText } from "@/lib/pdf-extractor";

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get("file");

  const data = await extractPdfText(file);
  const summary = await summarizeDocument(data.text);

  return Response.json({ summary });
}
