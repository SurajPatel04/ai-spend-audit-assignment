# DEVLOG

## Day 1

Started with the frontend first because I wanted the audit flow and UX to feel clear before connecting backend logic.

Built the main audit page and spend form UI using React + TypeScript + Tailwind.

Today’s work:
- created reusable ToolCard components
- added team size + use case section
- added dynamic enable/disable flow for tools
- added monthly spend calculations
- added estimated pricing warnings
- implemented localStorage persistence using a custom hook
- structured tool configs separately to avoid hardcoding everything inside components

Also spent some time simplifying the pricing structure because the first version became too overengineered for the assignment.

Main focus today was making the form feel responsive and clean without adding unnecessary complexity yet.

---

## Day 2

Worked on backend setup and project structure.

Completed:
- setup Express + TypeScript backend
- connected PostgreSQL with Prisma
- configured Prisma client
- created app.ts and server.ts structure
- added asyncHandler utility
- created centralized ApiError class
- created reusable ApiResponse helpers
- added global error handling middleware
- started building the audit engine service
- created initial pricing data structure for supported AI tools

Also fixed multiple TypeScript + Prisma setup issues during configuration.

Next focus:
- connect frontend with backend audit API
- complete audit engine logic
- build results page
- save audits in database
- add report sharing flow