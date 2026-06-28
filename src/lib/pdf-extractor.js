import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse/lib/pdf-parse.js");

export async function extractPdfText(file) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const data = await pdfParse(buffer);

  return {
    text: data.text,
    pages: data.numpages,
  };
}

export function chunkText(text, maxChars = 3000) {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    chunks.push(text.slice(start, start + maxChars));
    start += maxChars;
  }

  return chunks;
}
