import { summarizeDocument } from "@/lib/claude-client";
import { extractPdfText } from "@/lib/pdf-extractor";
import pool from "@/lib/db";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json({ error: "File tidak ditemukan." }, { status: 400 });
    }

    if (!file.name.endsWith(".pdf")) {
      return Response.json(
        { error: "Hanya file PDF yang diizinkan." },
        { status: 400 },
      );
    }

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
  } catch (error) {
    return Response.json(
      { error: "Gagal memproses dokumen. Coba lagi." },
      { status: 500 },
    );
  }
}
