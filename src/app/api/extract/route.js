import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse/lib/pdf-parse.js");

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get("file");

  const buffer = Buffer.from(await file.arrayBuffer());
  const data = await pdfParse(buffer);

  return Response.json({
    text: data.text,
    pages: data.numpages,
  });
}
