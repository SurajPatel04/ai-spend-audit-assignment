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

---

## Day 3

Focused mostly on connecting the frontend and backend together and getting the actual audit flow working end-to-end.

Completed:
- built the main audit engine flow
- added modular audit rules for different AI tools
- added savings calculation helpers
- added alternative recommendation checks
- separated pricing data from business logic
- created audit types and shared interfaces
- created Prisma audit model
- added audit controller logic
- created audit routes
- connected frontend form submission with backend API
- added database persistence for generated audits
- added UUID-based audit IDs for report retrieval

Also spent time restructuring parts of the audit engine because the earlier implementation started duplicating pricing values in multiple places.

Main focus today was making the audit flow modular and easier to extend later without turning the backend into unnecessary enterprise-level architecture.

Next focus:
- build report/results page
- display recommendations visually
- add report sharing flow
- improve audit recommendation quality
- add AI-generated summaries