System Design Document - Doctor Appointment Booking System

 1. High-Level Architecture
The system uses a **Monolithic Layered Architecture** for simplicity and correctness in this assessment, but it is structured to be easily split into microservices (Booking Service, User Service).

Components:
Client (React + Vite):** Handles UI, State (TanStack Query), and optimistic updates where safe.
Server (Node + Express):** Stateless REST API layer.
Database (PostgreSQL):** Relational source of truth.

 2. Concurrency Handling (The Core Problem)
The most critical requirement was preventing Double Booking (Race Conditions) when multiple users try to book the same slot simultaneously.



3. Scalability Strategy
To scale this to "RedBus/BookMyShow" levels:

 Database Scaling
Read Replicas: Send `GET /slots` traffic to Read Replicas. Only `POST /book` goes to Primary.
Sharding: Shard the `Slot` and `Booking` tables by `doctorId` or `Region`. A slot always belongs to one specific shard, preserving ACID guarantees within that shard.

Caching
Redis: Cache `GET /slots` responses for 5-10 seconds.
Cache Invalidation: When a booking occurs, invalidate the specific doctor's slot cache.

 Deployment
Frontend:Vercel (Static hosting, optimized CDN).
Backend Render/Railway (Node.js runtime).
Database: Managed Postgres (Supabase/Neon/RDS).
