# Architecture

## 1. System Diagram

```mermaid
flowchart TD
    subgraph Frontend [Client - React / Vite]
        UI[Web UI / Forms]
        LocalStorage[(Local Storage)]
    end

    subgraph Backend [Server - Node.js / Express]
        API[API Router]
        Engine[Deterministic Audit Engine]
        LLM[LLM Summary Service]
        Email[Resend Email Service]
    end

    subgraph External [External Services]
        Gemini[Gemini API / Anthropic]
        Postgres[(PostgreSQL Database)]
        ResendAPI[Resend API]
    end

    UI -->|1. Submit Spend Data| API
    UI <-->|State Persistence| LocalStorage
    
    API -->|2. Run Rules| Engine
    Engine -->|3. Save Result| Postgres
    Engine -->|4. Return Data| UI
    
    UI -->|5. Request Summary| LLM
    LLM -->|6. Generate| Gemini
    LLM -->|7. Save Summary| Postgres
    
    UI -->|8. Submit Lead Capture| API
    API -->|9. Send Email| Email
    Email -->|10. Dispatch| ResendAPI
```

---

## 2. Data Flow: From Input to Audit Result

1. **Client-Side Capture:** The user inputs their tools, seats, and spend. The state is instantly persisted to `localStorage` so they don't lose data on reload. Client-side validation ensures no empty inputs are sent.
2. **Deterministic Processing:** The frontend sends a JSON payload to the backend `POST /api/v1/audit`. The backend skips AI entirely for this step. It feeds the data into the **Audit Engine**, which runs through hardcoded `planRules` checking the user's input against the verified data in `PRICING_DATA.md`.
3. **Storage & Response:** The audit engine calculates total savings, flags overspending, and saves a record of the audit in the PostgreSQL database via Prisma. It returns an `auditId` and the math breakdown to the frontend.
4. **Asynchronous Summary:** The frontend routes the user to the Results page and immediately displays the financial savings. In the background, it calls the summary endpoint with the `auditId`.
5. **LLM Generation:** The backend fetches the audit results from the database, constructs a highly specific prompt, and queries the LLM. The qualitative summary is streamed/returned to the client and cached in the database.
6. **Lead Capture & Viral Loop:** If the user enters their email, the backend updates the audit record and triggers a transactional email via Resend containing their unique shareable public URL.

---

## 3. Why This Stack?

**Frontend: React (Vite) + TailwindCSS + TypeScript**
- *Why:* React provides the reactivity needed for a complex dynamic form. Vite is significantly faster than CRA or Webpack. Tailwind allows for rapid, premium styling without context switching. TypeScript prevents runtime type errors between the complex form state and the API payload.

**Backend: Node.js + Express.js**
- *Why:* Instead of building a monolith with Next.js, separating the backend isolates the API layer. This prevents vendor lock-in to Vercel's serverless environment, making it easy to deploy the backend on a persistent Node server (Render/Fly.io) avoiding serverless cold starts.

**Database: PostgreSQL + Prisma ORM**
- *Why:* Relational data makes sense here (an Audit has many Tools, an Audit belongs to a Lead). Prisma provides end-to-end type safety, making sure the backend API shapes strictly match the database schema.

**Core Decision: Deterministic Math over AI**
- *Why:* The most important architectural decision was **not** using an LLM to calculate savings. LLMs hallucinate math. By writing a deterministic rules engine, the financial output is 100% reliable, testable, and defensible. The LLM is used strictly as a presentation layer for the summary.

---