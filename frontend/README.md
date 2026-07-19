<div align="center">
  <img src="./frontend/public/icon.png" alt="NeuroFlow AI Logo" width="120" />
  <h1>NeuroFlow AI</h1>
  <p><strong>The Intelligence Layer for Your Productivity</strong></p>
  <p>An advanced, AI-powered work management system featuring an Adaptive Planner, Knowledge Vault, Workflow Engine, and a seamless Second Brain.</p>
</div>

---

## ✨ Features

- 🧠 **Second Brain (RAG System)**: Automatically stores tasks, document insights, and AI chats using vector embeddings. Semantic search allows you to retrieve past context effortlessly (e.g., "What did I work on last week?").
- 📅 **Adaptive Planner**: Intelligently schedules and organizes your tasks.
- 🗄 **Knowledge Vault**: Organize, summarize, and extract insights from uploaded documents using Google Gemini.
- ⚙️ **Workflow Engine**: Automate multi-step processes via an intuitive nodal interface.
- 🤖 **AI Assistant**: Deeply integrated Gemini chat agent for drafting, ideation, and real-time support.
- ⚡ **Global Command Palette**: Lightning-fast navigation (Ctrl + K) to search tasks, documents, and jump between modules.

## 🚀 Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS, Lucide Icons, Framer Motion
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **AI Integration**: Google Gemini (`@google/genai`), RAG (Retrieval-Augmented Generation) vector embeddings via cosine similarity

## 🛠 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL installed and running locally (or a remote instance)

### 2. Installation

Clone the repository:
```bash
git clone https://github.com/AkashShekhawat18/PromptWars-x-CodexSec.git
cd PromptWars-x-CodexSec/frontend
```

Install dependencies:
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the `frontend` directory:
```env
# Database Connection (update with your postgres credentials)
DATABASE_URL="postgresql://postgres:password@localhost:5432/neuroflow"

# Authentication Secrets
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
```

Create a `.env.local` file in the `frontend` directory:
```env
# Gemini API Key (Get yours at https://aistudio.google.com/apikey)
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Database Initialization
Push the schema to your database and generate the Prisma Client:
```bash
npx prisma db push
npx prisma generate
```

### 5. Start the Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` to start using NeuroFlow AI!

## 🔐 Demo Accounts
For hackathons and quick evaluation, the following demo accounts are automatically provisioned:
- **Admin Portal**: `admin@neuroflow.ai` / `admin123`
- **Standard User**: `user@neuroflow.ai` / `user1234`

## 🎨 UI & Aesthetics
NeuroFlow AI features a premium "Glassmorphism Dark Mode" aesthetic, ensuring deep focus and reduced eye strain. Features include dynamic micro-animations, tailored gradient accents (`#6C5CE7` to `#00D2D3`), and fully responsive layouts.

---

<div align="center">
  Built for maximum focus. Engineered for continuous momentum.
</div>
