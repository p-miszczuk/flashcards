# Flashcards App

English vocabulary flashcard app with groups, two-sided cards, and learned/to-learn tracking.

## Stack

- **Frontend:** React + Vite + TypeScript + TailwindCSS + React Router
- **Backend:** Node.js + Express + Prisma + SQLite

## Getting Started

### 1. Backend

```bash
cd backend
npm install
npx prisma db push
node prisma/seed.js   # creates 3 default groups: Sport, Hobby, Verbs
npm run dev           # starts on http://localhost:3001
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev           # starts on http://localhost:5173
```

## Features

- Create, edit, delete groups
- Add, edit, delete flashcards (front / back)
- Two-sided card flip animation
- Tabs: To Learn / Learned
- Mark cards as learned or move back to learning
- All items sorted newest first
- Data persisted in SQLite via Prisma
