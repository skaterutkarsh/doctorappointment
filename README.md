 Doctor Appointment Booking System

Overview
A production-grade, highly scalable "Doctor Appointment Booking System" focused on healthcare. Ideally suited for handling high concurrency to prevent double-booking using Pessimistic Locking.

Tech Stack
Backend: Node.js, Express, TypeScript, Prisma, PostgreSQL
Frontend: React, Vite, TypeScript, Tailwind CSS, TanStack Query

Prerequisites
Node.js 
PostgreSQL (or Docker to run it locally)

Getting Started

1. Database Setup
2. Backend Setup
cd server
npm install
Run Migrations
npx prisma migrate dev --name init
# Start Server
npm run dev


3. Frontend Setup
cd client
npm install
npm run dev

