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

Still need to:
- connect frontend to backend API
- build audit engine
- create results page
- save reports in DB