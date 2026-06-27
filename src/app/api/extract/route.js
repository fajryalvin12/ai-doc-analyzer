import { summarizeDocument } from "@/lib/claude-client";
import { extractPdfText } from "@/lib/pdf-extractor";
import pool from "@/lib/db";

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get("file");

  // 1. Ekstrak teks dari PDF
  const data = await extractPdfText(file);

  // 2. Summarize dengan Claude
  const summary = await summarizeDocument(data.text);

  // 3. Simpan ke tabel files
  const result = await pool.query(
    `INSERT INTO files (file_name, extracted_text, summary) 
     VALUES ($1, $2, $3) RETURNING id`,
    [file.name, data.text, summary],
  );

  const fileId = result.rows[0].id;

  return Response.json({
    fileId,
    summary,
  });
}
