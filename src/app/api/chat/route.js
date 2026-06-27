import { answerQuestion } from "@/lib/claude-client";
import pool from "@/lib/db";

export async function POST(request) {
  const { fileId, question } = await request.json();

  // 1. Ambil extracted text dari DB berdasarkan fileId
  const fileResult = await pool.query(
    `SELECT extracted_text FROM files WHERE id = $1`,
    [fileId],
  );

  if (fileResult.rows.length === 0) {
    return Response.json({ error: "File not found" }, { status: 404 });
  }

  const extractedText = fileResult.rows[0].extracted_text;

  // 2. Jawab pertanyaan dengan Claude
  const answer = await answerQuestion(extractedText, question);

  // 3. Simpan ke history_chat
  await pool.query(
    `INSERT INTO history_chat (file_id, question, answer) 
     VALUES ($1, $2, $3)`,
    [fileId, question, answer],
  );

  return Response.json({ answer });
}
