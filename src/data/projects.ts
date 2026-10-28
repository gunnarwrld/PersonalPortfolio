export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  tech: string[];
  features: string[];
  github?: string;
  live?: string;
  role: string;
  timeline: string;
  image?: string;
}

export const projects: Project[] = [
  {
    id: "smart-home-gitops",
    title: "Smart Home GitOps",
    subtitle: "Android Security Monitor",
    description:
      "Built an Android app that detects adversarial AI attacks on GitOps infrastructure in real time — using a 7-pattern on-device heuristic engine and a full GitHub REST API write loop to let a human operator force-merge or reject from the app.",
    longDescription:
      "Architected a fully functional Android application around a cybersecurity research scenario: a smart home managed as infrastructure-as-code, where a legitimate AI (EcoAgent) proposes energy-saving changes via Pull Requests while an adversarial AI (LuxAgent) injects psychologically-crafted deceptive comments to manipulate the human operator into rejecting them. Built the threat detection engine as a pure Kotlin domain object — zero Android dependencies — implementing a 7-category weighted heuristic that scores PR comments against patterns like HVAC failure language, direct blocking commands, and artificial urgency, triggering a security alert at 40% or above. Implemented MVVM + Clean Architecture with a strict unidirectional dependency rule (UI → ViewModel → Repository → API), using StateFlow for UI state and SharedFlow for one-shot snackbar events, with a 30-second background polling loop managed in viewModelScope. Closed the full GitOps write loop from the app: on Force Merge, the app fetches the current blob SHA, decodes Base64 JSON, modifies the infrastructure state, re-encodes, commits directly to main via PUT /contents, then closes the PR via PATCH /pulls — all in a single atomic coroutine sequence. Hardened all write operations with a 3-layer catch (HttpException per status code, IOException, generic fallback) and a double-submit guard, ensuring zero crashes on network failure.",
    tech: [
      "Kotlin 2.2.0",
      "Jetpack Compose",
      "MVVM",
      "Clean Architecture",
      "Kotlin Coroutines",
      "StateFlow",
      "Retrofit 2",
      "OkHttp 4",
      "Gson",
      "GitHub REST API",
      "Gradle 9",
    ],
    features: [
      "On-device 7-pattern weighted heuristic engine — zero network calls for detection",
      "Full GitOps write loop: fetch SHA, modify JSON, commit to main, close PR",
      "MVVM + Clean Architecture with strict unidirectional dependency rule",
      "30s background polling loop with StateFlow-driven animated state transitions",
      "3-layer fault tolerance — HttpException per status code, IOException, safety net",
      "Token injected via BuildConfig at compile time — zero hardcoded secrets",
    ],
    github: "https://github.com/gunnarwrld/smart-home-gitops",
    role: "Solo Developer",
    timeline: "2026",
  },
  {
    id: "hkif-web",
    title: "HKIF Website",
    subtitle: "Sports Union Platform",
    description:
      "Built the backend for a university sports union: 4-tier RBAC, JWT auth, Prisma + PostgreSQL, and a Vitest + Supertest integration suite — deployed on Railway.",
    longDescription:
      "Architected the entire backend from zero using Node.js, Express 5, and TypeScript, establishing a typed ApiError factory, ApiResponse<T> envelope, and asyncHandler boundary before any feature work began, giving every route a consistent and testable error contract. Designed a relational PostgreSQL schema via Prisma ORM with conflict-detection fields, capacity constraints, and role enumerations; resolved a blocking Prisma 7 migration by introducing a custom prisma.config.ts adapter split and correcting client generation order in the Railway CI pipeline. Secured the API with JWT authentication, bcrypt password hashing, and a 4-tier RBAC system (MEMBER / LEADER / BOARD_MEMBER / ADMIN), enforced through a unified authMiddleware + restrictToMinRole chain with DTO projection to guarantee zero credential leakage. Built the integration test suite from scratch with Vitest and Supertest, covering auth, activity, participation, and favorites flows with shared setup/teardown helpers — reaching full endpoint coverage before the first production deploy.",
    tech: [
      "Node.js",
      "Express 5",
      "TypeScript",
      "Prisma ORM",
      "PostgreSQL",
      "JWT",
      "bcryptjs",
      "Vitest",
      "Supertest",
      "Railway",
      "React",
      "Vite",
    ],
    features: [
      "4-tier RBAC: MEMBER / LEADER / BOARD_MEMBER / ADMIN",
      "JWT auth with DTO projection — zero credential leakage",
      "Activity scheduling with conflict detection and capacity limits",
      "Typed ApiError factory and ApiResponse<T> envelope on every route",
      "Integration test suite built from zero with Vitest + Supertest",
      "Railway deployment unblocked by resolving Prisma 7 config split",
    ],
    github: "https://github.com/jasminerezai/hkif-web",
    live: "https://hkif-web.vercel.app/",
    role: "Backend Lead",
    timeline: "2026",
  },
  {
    id: "futbol-data-aggregator",
    title: "Fútbol Data Aggregator",
    subtitle: "Soccer Data REST API",
    description:
      "TypeScript API that ingests API-Football into PostgreSQL with Prisma 7 and serves leagues, teams, matches, and players from Express 5, with Redis caching, BullMQ sync jobs, and Socket.io live updates.",
    longDescription:
      "Layered Node.js service: routes, controllers, services, and Prisma repositories, plus an API-Football client. package.json pins Express 5 and Prisma 7 (prisma.config.ts and SQL migrations). BullMQ workers on Redis schedule league and team sync daily, fixture sync every 6 hours, and live-match sync every 60 seconds, so a repeated job runs once even if several servers are up. When a live sync sees a score or event change it emits Socket.io match:update and match:event on /api/v1/realtime. Anonymous traffic is capped at 50 requests an hour per IP by a Redis sliding window; API keys carry their own limit. Vitest covers the error and response helpers. The Railway URL is wired up while the service is redeployed.",
    tech: [
      "TypeScript",
      "Node.js",
      "Express 5",
      "Prisma 7",
      "PostgreSQL",
      "Redis",
      "BullMQ",
      "Socket.io",
      "Zod",
      "Vitest",
      "Railway",
    ],
    features: [
      "Versioned REST resources for leagues, teams, matches, and players",
      "Prisma 7 schema and SQL migrations for the soccer model",
      "BullMQ workers for daily, 6-hour, and 60-second syncs",
      "Socket.io rooms for live scores and match events",
      "Redis sliding-window rate limits and API keys",
      "Vitest unit tests for AppError and the response envelope",
    ],
    github: "https://github.com/gunnarwrld/futbol_data_aggregator_api",
    live: "https://futboldataaggregatorapi-production.up.railway.app",
    role: "Solo Developer",
    timeline: "2026",
  },
  {
    id: "ledger-api",
    title: "Ledger Forge",
    subtitle: "Double-Entry Wallet API",
    description:
      "Kotlin and Spring Boot ledger that stores money as integer minor units, writes balanced journal entries to PostgreSQL, and locks wallet rows so concurrent transfers cannot overdraw.",
    longDescription:
      "REST service for a small auditable wallet. Amounts are positive longs in minor units (1250 SEK is 12.50) with an ISO 4217 currency code — no floats in the API. Every transfer is a journal entry: the service checks that debits equal credits, and a deferred PostgreSQL trigger checks again at commit. POST /api/v1/transfers requires an Idempotency-Key; the same key and body replay the original receipt, and a different body returns 409. Transfers take SELECT … FOR UPDATE on both wallet rows in UUID order under READ COMMITTED, with a JPA @Version check. Flyway applies the schema and the append-only triggers at startup. Local Postgres comes from docker compose; there is no Dockerfile. Integration tests use Spring Boot, MockMvc, and H2 in PostgreSQL mode, including an idempotent replay, a key-reuse conflict, and a parallel overdraw check. Auth, FX, and fees are intentionally out of scope. No public deployment.",
    tech: [
      "Kotlin",
      "Spring Boot",
      "PostgreSQL",
      "Flyway",
      "Spring Data JPA",
      "JUnit 5",
      "MockMvc",
      "Docker Compose",
      "OpenAPI",
    ],
    features: [
      "Double-entry journals checked again by a Postgres trigger at commit",
      "Idempotency-Key on transfers, with 409 when the body changes",
      "Row locks in UUID order so concurrent spends cannot overdraw",
      "Append-only postings protected from UPDATE and DELETE",
      "Flyway migrations, including the balance-enforcement triggers",
      "Spring Boot integration tests for replay, conflict, and concurrency",
    ],
    github: "https://github.com/gunnarwrld/ledger-api",
    role: "Solo Developer",
    timeline: "2026",
  },
  {
    id: "clicky-recurring-runs",
    title: "Clicky Recurring Runs",
    subtitle: "Recurring-Run Scheduler API",
    description:
      "FastAPI service that stores explicit recurring schedules in SQLite and enqueues each due occurrence once, even when scheduler ticks overlap.",
    longDescription:
      "A local demo of one backend detail behind user-requested recurring agent work. It does not connect to HeyClicky and it does not call a model. Schedules are created explicitly; the first run defaults to one interval after creation, and starts_at can pin a timezone-aware start. Pause stops a schedule. Resume starts a fresh interval so a long pause does not dump missed work onto the queue. POST /scheduler/tick enqueues due occurrences. The tick takes a SQLite BEGIN IMMEDIATE lock, and a unique (schedule_id, occurrence_at) constraint is the last guard against duplicate rows. Catch-up is capped at 500 occurrences per tick. pytest covers catch-up, repeated and concurrent ticks, pause/resume, timezone validation, and missing schedules.",
    tech: ["Python", "FastAPI", "Pydantic", "SQLite", "Uvicorn", "pytest"],
    features: [
      "Explicit schedules with pause and resume",
      "Tick endpoint that enqueues only due occurrences",
      "SQLite write lock plus a unique constraint against duplicate runs",
      "Catch-up limited to 500 occurrences per tick",
      "pytest for overlap, pause/resume, and timezone validation",
      "OpenAPI docs from FastAPI at /docs",
    ],
    github: "https://github.com/gunnarwrld/clicky-recurring-runs",
    role: "Solo Developer",
    timeline: "2026",
  },
  {
    id: "financetracker",
    title: "FinanceTracker",
    subtitle: "Personal Finance PWA",
    description:
      "Multi-currency personal finance PWA on Supabase — Google OAuth, Postgres with row-level security, and Groq spending insights through the groq-proxy Edge Function.",
    longDescription:
      "React and TypeScript SPA built with Vite. Supabase handles Google OAuth, PostgreSQL, and row-level security policies so budgets, transfers, bills, and subscription rows stay scoped to the signed-in user. Multi-currency amounts convert through the Frankfurter API. Spending insights call the groq-proxy Edge Function, which checks the caller and forwards the prompt to Groq (llama-3.3-70b-versatile). That function is the only one under supabase/functions. The client includes Stripe Checkout and Customer Portal helpers, and the README describes create-checkout-session, create-portal-session, and stripe-webhooks, but those handlers are not in the repository. vite-plugin-pwa with Workbox makes the app installable. The repo does not measure a load-time change.",
    tech: [
      "React",
      "TypeScript",
      "Vite",
      "Supabase",
      "PostgreSQL",
      "Supabase Edge Functions",
      "Groq",
      "Zod",
      "TanStack Query",
      "PWA",
    ],
    features: [
      "Multi-account tracking with Frankfurter exchange rates",
      "Google OAuth and Supabase RLS on user-owned rows",
      "Groq insights via the checked-in groq-proxy Edge Function",
      "Budgets, bill reminders, recurring transactions, and transfers",
      "Installable PWA (vite-plugin-pwa and Workbox)",
      "Zod form schemas and TanStack Query for server state",
    ],
    github: "https://github.com/gunnarwrld/personal-finance-web-app",
    live: "https://personal-finance-web-app-psi.vercel.app/",
    role: "Full-Stack Developer",
    timeline: "2025",
  },
  {
    id: "ai-study-assistant",
    title: "AI Study Assistant",
    subtitle: "Edge AI Learning Tool",
    description:
      "Study chat in plain JavaScript on Cloudflare Workers: a Durable Object stores each session in SQLite and calls Llama 3.3 through Workers AI over REST and WebSocket.",
    longDescription:
      "worker/index.js routes /health, /api/chat, /api/history, and /api/search. StudyAgent is a Durable Object (worker/study-agent.js) that keeps conversation history in SQLite and calls Workers AI model @cf/meta/llama-3.3-70b-instruct-fp8-fast. The same session can talk over WebSocket; the README documents the chat, getHistory, and search message types. The frontend is frontend/index.html, styles.css, and app.js — vanilla JavaScript on Cloudflare Pages, not TypeScript or React. package.json's test script only prints that testing is not implemented, and the repo has no GitHub Actions workflow. Deploy is wrangler deploy for the Worker and wrangler pages deploy for the UI.",
    tech: [
      "JavaScript",
      "Cloudflare Workers",
      "Workers AI",
      "Llama 3.3",
      "Durable Objects",
      "SQLite",
      "WebSockets",
      "Cloudflare Pages",
    ],
    features: [
      "Per-session history in a Durable Object with SQLite",
      "REST for chat, history, search, and clear",
      "WebSocket chat with the message types from the README",
      "Llama 3.3 70B instruct via Workers AI",
      "Vanilla JavaScript UI hosted on Cloudflare Pages",
      "Wrangler deploy scripts; no test suite and no CI workflow",
    ],
    github: "https://github.com/gunnarwrld/cf_ai_study_assistant",
    live: "https://cf-ai-study-assistant.pages.dev/",
    role: "Solo Developer",
    timeline: "2025",
  },
  {
    id: "portfolio",
    title: "Personal Portfolio",
    subtitle: "Developer Portfolio Website",
    description:
      "A motion-first single-page portfolio with scroll-linked Framer Motion animations, a hardened serverless contact form, and a full Vitest + Playwright test suite — live at gunnarwrld.com.",
    longDescription:
      "Built with React 18 + TypeScript 5 + Vite + SWC for a strict-typed, fast dev loop. Engineered scroll-linked Framer Motion parallax, spring physics, and 3D card reveals on a glass UI aesthetic with a Syne/Inter/JetBrains Mono type stack. Hardened the contact form against abuse by combining Vercel Functions (Node 20), React Hook Form + Zod for dual-layer client/server validation, per-IP rate limiting, and a honeypot field — eliminating spam while keeping delivery reliable via Resend. Enforced quality at every push with a Vitest + Testing Library unit suite, Playwright end-to-end tests, and a GitHub Actions CI workflow running ESLint flat config and type-checked Vite + SWC production builds on every PR.",
    tech: [
      "React 18",
      "TypeScript 5",
      "Vite",
      "Tailwind CSS",
      "Framer Motion",
      "shadcn/ui",
      "Radix UI",
      "React Hook Form",
      "Zod",
      "Vercel Functions",
      "Resend",
      "Vitest",
      "Playwright",
    ],
    features: [
      "Scroll-linked Framer Motion parallax and 3D card reveals",
      "Glass UI aesthetic with custom design tokens",
      "Contact form hardened with per-IP rate limiting and honeypot",
      "Dual-layer Zod validation (client + Vercel Function)",
      "Vitest unit tests and Playwright E2E suite",
      "GitHub Actions CI with ESLint flat config on every PR",
    ],
    github: "https://github.com/gunnarwrld/PersonalPortfolio",
    live: "https://gunnarwrld.com/",
    role: "Solo Developer",
    timeline: "2026 — ongoing",
  },
  {
    id: "posthub",
    title: "PostHub",
    subtitle: "Dynamic Single Page Application",
    description:
      "Responsive blogging SPA in vanilla JavaScript — no framework — that loads DummyJSON posts with client-side user caching, hash routing, and a Load More list.",
    longDescription:
      "index.html, style.css, and script.js. Posts, comments, and author profiles come from the DummyJSON REST API. User records are cached on a plain appData object so a profile is not fetched twice. The list grows through a Load More button (setupLoadMoreButton / loadMorePosts). The README still lists a continuous feed as a later idea. Hash routing, modals, and a validated contact form are all in the same script. Mobile-first CSS. No measured render-time figure is in the repository.",
    tech: ["Vanilla JavaScript", "HTML5", "CSS3", "REST APIs"],
    features: [
      "Post list that grows with a Load More button",
      "Post details, comments, and author profile modals",
      "In-memory cache for user profiles",
      "Hash routing without a framework",
      "Mobile-first layout and a validated contact form",
    ],
    github: "https://github.com/gunnarwrld/PostHub-DynamicWebsite",
    live: "https://post-hub-dynamic-website.vercel.app/",
    role: "Frontend Developer",
    timeline: "2024",
  },
];
