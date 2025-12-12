# Doctor Appointment Booking System

## Overview
A production-grade, highly scalable "Doctor Appointment Booking System" focused on healthcare. Ideally suited for handling high concurrency to prevent double-booking using Pessimistic Locking.

## Tech Stack
- **Backend:** Node.js, Express, TypeScript, Prisma, PostgreSQL
- **Frontend:** React, Vite, TypeScript, Tailwind CSS, TanStack Query

## Prerequisites
- Node.js (v18+)
- PostgreSQL (or Docker to run it locally)

## Getting Started

### 1. Database Setup
If you have Docker installed:
```bash
docker-compose up -d
```
This spins up a Postgres instance at `localhost:5432`.
Credentials: `user` / `password`, DB: `ticket_booking`.

### 2. Backend Setup
```bash
cd server
npm install
# Create .env file (copy .env.example if available, or use specific strings)
# Run Migrations
npx prisma migrate dev --name init
# Start Server
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

## Architecture
See [DESIGN.md](./DESIGN.md) for details on Concurrency Handling and Scaling.
