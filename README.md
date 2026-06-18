# Lead Capture AI Agent

A full-stack web application that captures business leads, scores them using AI, and generates personalised email drafts automatically.

## Live Demo
- Frontend: [your-vercel-url]
- Backend: [your-render-url]

## Features
- Lead capture form with client-side and server-side validation
- AI-powered lead scoring (Hot / Warm / Cold) using GPT-4o
- Auto-generated personalised email drafts for each lead
- Admin panel showing all leads with scores and email drafts
- Duplicate email detection
- Clean dark UI with Tailwind CSS

## Tech Stack
- Frontend: React + TypeScript + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB (Atlas)
- AI: OpenAI GPT-4o

## Setup Instructions

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account
- OpenAI API key

### Backend
```bash
cd backend
npm install
```

Create `.env` file:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
```

```bash
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`

## Environment Variables

| Variable | Description |
|----------|-------------|
| PORT | Backend port (default 5000) |
| MONGODB_URI | MongoDB Atlas connection string |
| OPENAI_API_KEY | OpenAI API key |

## Database Schema

```json
{
  "_id": "ObjectId",
  "fullName": "String (required)",
  "email": "String (required, unique)",
  "businessName": "String (required)",
  "message": "String (required)",
  "aiScore": "String (Hot | Warm | Cold)",
  "aiReason": "String",
  "emailDraft": "String",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## AI Tools I Used and How

- **Claude (Anthropic)** — Used throughout development as a coding partner to scaffold the project structure, debug errors, and improve code quality
- **GPT-4o (OpenAI)** — Used inside the application to qualify leads and generate email drafts
- AI tools were used as thinking partners, not just autocomplete — every decision was reviewed and understood before committing

## My AI Orchestration Decisions

**Model choice:** GPT-4o
- Reason: Strong JSON output reliability, good at understanding business context, generous free tier

**Prompt design:**
- Gave the model clear role context ("You are a lead qualification AI for Oplify Solutions")
- Provided structured input (name, email, business, message)
- Defined exact scoring criteria (Hot = clear intent, Warm = exploring, Cold = generic)
- Forced strict JSON output to make parsing reliable
- Added "no extra text" instruction to prevent markdown wrapping

**Tradeoffs considered:**
- GPT-4o vs Gemini: chose GPT-4o for more consistent JSON formatting
- Scoring + email in one call vs two calls: chose one call to reduce latency and cost
- If AI fails, lead is still saved — graceful degradation

## Bonus Feature — Duplicate Detection
Before saving a lead, the API checks if the email already exists in the database. If duplicate is found, returns a 409 error with a clear message to the user.

## Project Structure
```
lead-capture-agent/
├── backend/
│   ├── models/
│   │   └── Lead.js
│   ├── routes/
│   │   └── leads.js
│   ├── server.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LeadForm.tsx
│   │   │   └── AdminPanel.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   └── package.json
├── schema.sql
└── README.md
```