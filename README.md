# AI Document Analyzer

An AI-powered document analysis tool that extracts text from PDF files, generates instant summaries, and answers questions based on document content — built with Next.js and Anthropic Claude API.

🔗 **Live Demo:** [ai-doc-analyzer-psi.vercel.app](https://ai-doc-analyzer-psi.vercel.app)

---

## Features

- 📄 **PDF Upload & Parsing** — Upload any PDF and extract its text content instantly
- 🤖 **AI-Powered Summary** — Automatically generates a structured summary using Claude AI
- 💬 **Document Q&A** — Ask anything about the document and get accurate answers based on its content
- 🗂️ **Chat History** — All questions and answers are saved to a PostgreSQL database per document
- ⚡ **Streaming Response** — AI responses stream in real-time for a smooth user experience

---

## Tech Stack

| Layer       | Technology                               |
| ----------- | ---------------------------------------- |
| Frontend    | Next.js 14, Tailwind CSS, React          |
| AI          | Anthropic Claude API (claude-sonnet-4-6) |
| PDF Parsing | pdf-parse                                |
| Database    | PostgreSQL via Supabase                  |
| Deploy      | Vercel                                   |

---

## How It Works

```
User uploads PDF
      ↓
pdf-parse extracts raw text
      ↓
Text sent to Claude API as context
      ↓
Claude generates summary → saved to DB
      ↓
User asks questions → Claude answers based on document
      ↓
Q&A history saved to DB per document
```

---

## Project Structure

```
src/
  app/
    page.js               # Main UI
    api/
      extract/
        route.js          # PDF upload + summary endpoint
      chat/
        route.js          # Q&A endpoint
  lib/
    claude-client.js      # Anthropic API integration
    pdf-extractor.js      # PDF parsing + text chunking
    db.js                 # PostgreSQL connection
```

---

## Database Schema

```sql
CREATE TABLE files (
  id SERIAL PRIMARY KEY,
  file_name VARCHAR(255),
  extracted_text TEXT,
  summary TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE history_chat (
  id SERIAL PRIMARY KEY,
  file_id INTEGER REFERENCES files(id),
  question TEXT,
  answer TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/fajryalvin12/ai-doc-analyzer.git
cd ai-doc-analyzer
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
ANTHROPIC_API_KEY=your_anthropic_api_key
DATABASE_URL=your_supabase_connection_string
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Key Technical Decisions

**Why pdf-parse?**
Lightweight and straightforward for extracting raw text from PDFs in a Node.js environment without requiring additional system dependencies.

**Why context chunking?**
PDF documents can be very long and may exceed Claude's context window. Chunking splits the text into smaller pieces to prevent `context_length_exceeded` errors and ensure reliable processing.

**Why Supabase?**
Provides a managed PostgreSQL instance with a generous free tier — ideal for storing document metadata and chat history without infrastructure overhead.

**Why streaming?**
Streaming AI responses token-by-token significantly improves perceived performance, especially for longer summaries and detailed answers.

---

## Author

**Fajry Alvin Hidayat**
Fullstack Web Developer | React, Next.js, Go, PHP

- Portfolio: [portfolio-fajryalvin.vercel.app](https://portfolio-fajryalvin.vercel.app)
- GitHub: [github.com/fajryalvin12](https://github.com/fajryalvin12)
- LinkedIn: [linkedin.com/in/fajryalvinhidayat](https://linkedin.com/in/fajryalvinhidayat)
