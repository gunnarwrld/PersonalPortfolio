export type ProjectStatus =
  | "Live"
  | "Local demo"
  | "Coursework"
  | "Learning project";

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  tech: string[];
  features: string[];
  /**
   * `owner/name` of a repository tracked in `github-sync.json`.
   * When set, the card reads languages, last push, live URL, repo URL, and
   * archived from that file. Blurbs, features, status, and array order stay here.
   */
  repo?: string;
  github?: string;
  live?: string;
  role: string;
  timeline: string;
  /** What a visitor can expect today: deployed, run-it-yourself, or a course/learning piece. */
  status: ProjectStatus;
  /** Honest limits, shown in a separate block so the description stays about what the project does. */
  limits?: string;
  image?: string;
}

// Order matters: the carousel opens on the first project.
// Lead with the work that best shows backend engineering and that Gunnar can walk through in depth.
export const projects: Project[] = [
  {
    id: "hkif-web",
    title: "HKIF Website",
    subtitle: "Sports Union Platform",
    description:
      "Backend work on a student team's platform for a university sports union: JWT auth, a four-level role hierarchy, Prisma + PostgreSQL, and the Vitest + Supertest integration test setup, deployed on Railway.",
    longDescription:
      "Express 5 and TypeScript API for booking and running sports activities. I implemented the authentication system (registration, login, bcrypt hashing, JWT verification) and replaced per-route role checks with one middleware chain over a four-level hierarchy: MEMBER < LEADER < BOARD_MEMBER < ADMIN, with exact-role and minimum-role guards. I set up the Vitest + Supertest harness with a test database and wrote the first suites for auth, activities, participation and favourites, including 401/403 cases for role-gated routes. I also moved the server to NodeNext module resolution so the compiled output runs on Railway, fixed the Prisma client generation order in the build, replaced schedule hard-deletes with a status update, and added a date-range endpoint so the month view needs one request instead of several. Each change went in as its own pull request.",
    tech: [
      "Node.js",
      "Express 5",
      "TypeScript",
      "Prisma ORM",
      "PostgreSQL",
      "JWT",
      "bcryptjs",
      "Zod",
      "Vitest",
      "Supertest",
      "Railway",
    ],
    features: [
      "JWT auth with register, login and a token-checked /me endpoint",
      "Four-level role hierarchy with exact-role and minimum-role guards",
      "Vitest + Supertest harness against a separate test database",
      "Schedule status changes instead of hard deletes, so history is kept",
      "Date-range and month endpoint with Zod-validated query parameters",
      "Railway deploy fixed by switching to NodeNext module resolution",
    ],
    // jasminerezai/hkif-web is outside the gunnarwrld watch list, so this card stays manual.
    github: "https://github.com/jasminerezai/hkif-web",
    live: "https://hkif-web.vercel.app/",
    role: "Backend developer, student team",
    timeline: "2026",
    status: "Live",
  },
  {
    id: "futbol-data-aggregator",
    title: "Fútbol Data Aggregator",
    subtitle: "Soccer Data REST API",
    description:
      "TypeScript API that ingests API-Football into PostgreSQL with Prisma 7 and serves leagues, teams, matches, and players from Express 5, with Redis caching, BullMQ sync jobs, and Socket.io live updates.",
    longDescription:
      "Layered Node.js service: routes, controllers, services, and Prisma repositories, plus an API-Football client. package.json pins Express 5 and Prisma 7 (prisma.config.ts and SQL migrations). BullMQ workers on Redis schedule league and team sync daily, fixture sync every 6 hours, and live-match sync every 60 seconds, so a repeated job runs once even if several servers are up. When a live sync sees a score or event change it emits Socket.io match:update and match:event on /api/v1/realtime. Anonymous reads are capped at 50 requests an hour per IP by a Redis sliding window. Writes require an API key, and each key carries its own limit. Vitest unit tests and Supertest integration tests run against PostgreSQL and Redis. GitHub Actions runs lint, typecheck, those tests with coverage, and a Docker image build. docker compose starts PostgreSQL 16, Redis 7, and the API.",
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
      "Supertest",
      "Docker Compose",
      "GitHub Actions",
      "Railway",
    ],
    features: [
      "Versioned REST resources for leagues, teams, matches, and players",
      "Prisma 7 schema and SQL migrations for the soccer model",
      "BullMQ workers for daily, 6-hour, and 60-second syncs",
      "Socket.io rooms for live scores and match events",
      "Redis sliding-window rate limits and API keys",
      "Vitest unit tests and Supertest integration tests for routes, services, and sync jobs",
    ],
    repo: "gunnarwrld/futbol_data_aggregator_api",
    github: "https://github.com/gunnarwrld/futbol_data_aggregator_api",
    live: "https://futboldataaggregatorapi-production.up.railway.app",
    role: "Solo Developer",
    timeline: "2026",
    status: "Live",
    limits:
      "The app does not set trust proxy, so behind Railway the anonymous 50-per-hour budget is shared by every client on that proxy.",
  },
  {
    id: "ledger-api",
    title: "Ledger Forge",
    subtitle: "Double-Entry Wallet API",
    description:
      "Kotlin and Spring Boot ledger that stores money as integer minor units, writes balanced journal entries to PostgreSQL, and locks wallet rows so concurrent transfers cannot overdraw.",
    longDescription:
      "REST service for a small auditable wallet. Amounts are positive longs in minor units (1250 SEK is 12.50) with an ISO 4217 currency code, with no floats in the API. Every transfer is a journal entry: the service checks that debits equal credits, and a deferred PostgreSQL trigger checks again at commit. POST /api/v1/transfers requires an Idempotency-Key; the same key and body replay the original receipt, and a different body returns 409. Transfers lock every involved account in ascending UUID order under READ COMMITTED before checking funds. Flyway applies the schema and the append-only triggers at startup. Docker Compose runs PostgreSQL 17 and the API, with a readiness probe. Integration tests start PostgreSQL 17 with Testcontainers and cover idempotent replay, key-reuse conflicts and concurrent transfers; CI runs them with ktlint, detekt and Kover.",
    tech: [
      "Kotlin",
      "Spring Boot",
      "PostgreSQL",
      "Flyway",
      "Spring Data JPA",
      "Testcontainers",
      "Docker Compose",
      "GitHub Actions",
      "OpenAPI",
    ],
    features: [
      "Double-entry journals checked again by a Postgres trigger at commit",
      "Idempotency-Key on transfers, with 409 when the body changes",
      "Row locks in UUID order so concurrent spends cannot overdraw",
      "Append-only postings protected from UPDATE and DELETE",
      "Integration tests on PostgreSQL 17 via Testcontainers",
      "CI with ktlint, detekt and Kover coverage",
    ],
    repo: "gunnarwrld/ledger-api",
    github: "https://github.com/gunnarwrld/ledger-api",
    role: "Solo Developer",
    timeline: "2026",
    status: "Local demo",
    limits:
      "Auth, FX and fees are out of scope. Not deployed publicly; run it with Docker Compose.",
  },
  {
    id: "clicky-recurring-runs",
    title: "Clicky Recurring Runs",
    subtitle: "Recurring-Run Scheduler API",
    description:
      "FastAPI service that stores explicit recurring schedules in SQLite and enqueues each due occurrence once, even when scheduler ticks overlap.",
    longDescription:
      "A local demo of one backend detail behind user-requested recurring agent work. Schedules are created explicitly; the first run defaults to one interval after creation, and starts_at can pin a timezone-aware start. Pause stops a schedule. Resume starts a fresh interval so a long pause does not dump missed work onto the queue. POST /scheduler/tick enqueues due occurrences. The tick takes a SQLite BEGIN IMMEDIATE lock, and a unique (schedule_id, occurrence_at) constraint is the last guard against duplicate rows. Catch-up is capped at 500 occurrences per tick. pytest covers catch-up, repeated and concurrent ticks, pause/resume, timezone validation, and missing schedules.",
    tech: ["Python", "FastAPI", "Pydantic", "SQLite", "Uvicorn", "pytest"],
    features: [
      "Explicit schedules with pause and resume",
      "Tick endpoint that enqueues only due occurrences",
      "SQLite write lock plus a unique constraint against duplicate runs",
      "Catch-up limited to 500 occurrences per tick",
      "pytest for overlap, pause/resume, and timezone validation",
      "OpenAPI docs from FastAPI at /docs",
    ],
    repo: "gunnarwrld/clicky-recurring-runs",
    github: "https://github.com/gunnarwrld/clicky-recurring-runs",
    role: "Solo Developer",
    timeline: "2026",
    status: "Local demo",
    limits: "Standalone demo: it does not call an AI model or connect to any product.",
  },
  {
    id: "financetracker",
    title: "FinanceTracker",
    subtitle: "Personal Finance PWA",
    description:
      "Multi-currency personal finance PWA on Supabase: Google OAuth, Postgres with row-level security, and Groq spending insights through the groq-proxy Edge Function.",
    longDescription:
      "React and TypeScript SPA built with Vite. Supabase handles Google OAuth, PostgreSQL, and row-level security policies so budgets, transfers, bills, and subscription rows stay scoped to the signed-in user. Postgres functions write a ledger row and adjust account balances in one transaction. Multi-currency amounts convert through the Frankfurter API. Spending insights call the groq-proxy Edge Function, which checks the caller and forwards the prompt to Groq (llama-3.3-70b-versatile). vite-plugin-pwa with Workbox makes the app installable.",
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
    repo: "gunnarwrld/personal-finance-web-app",
    github: "https://github.com/gunnarwrld/personal-finance-web-app",
    live: "https://personal-finance-web-app-psi.vercel.app/",
    role: "Full-Stack Developer",
    timeline: "2025",
    status: "Live",
    limits:
      "Payments are not enabled: the Stripe checkout, portal and webhook handlers are documented but not in the repository, so the demo runs in free mode.",
  },
  {
    id: "ai-study-assistant",
    title: "AI Study Assistant",
    subtitle: "Edge AI Learning Tool",
    description:
      "Study chat in plain JavaScript on Cloudflare Workers: a Durable Object stores each session in SQLite and calls Llama 3.3 through Workers AI over REST and WebSocket.",
    longDescription:
      "worker/index.js routes /health, /api/chat, /api/history, and /api/search. StudyAgent is a Durable Object (worker/study-agent.js) that keeps conversation history in SQLite and calls Workers AI model @cf/meta/llama-3.3-70b-instruct-fp8-fast. The same session can talk over WebSocket; the README documents the chat, getHistory, and search message types. The frontend is frontend/index.html, styles.css, and app.js: vanilla JavaScript. Deploy is wrangler deploy for the Worker and wrangler pages deploy for the UI.",
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
      "Vanilla JavaScript UI in frontend/, with a wrangler pages deploy script",
      "Wrangler deploy scripts for the Worker and the UI",
    ],
    repo: "gunnarwrld/cf_ai_study_assistant",
    github: "https://github.com/gunnarwrld/cf_ai_study_assistant",
    role: "Solo Developer",
    timeline: "2025",
    status: "Learning project",
    limits:
      "No automated test suite and no CI workflow; testing is a manual checklist. The Pages URL in the README returns 404, and the Worker does not serve the UI.",
  },
  {
    id: "portfolio",
    title: "Personal Portfolio",
    subtitle: "Developer Portfolio Website",
    description:
      "This site: a woodcut-style single-page portfolio with its own small design system, a rate-limited serverless contact form, and Vitest + Playwright checks in GitHub Actions.",
    longDescription:
      "Built with React 18 + TypeScript 5 + Vite + SWC. The woodcut look is a small token system on Tailwind CSS: ten colours with one job each, three self-hosted typefaces, and motion written in plain CSS that switches off for visitors who prefer reduced motion. Project cards read languages, last push and live links from a daily GitHub sync that opens a review pull request. The contact form posts to a Vercel Function (Node 20) that validates with Zod, applies a per-IP rate limit and a honeypot check, then sends through Resend. GitHub Actions runs ESLint, a TypeScript check of the app and the API, Vitest unit tests (including tests that keep this project copy matched to the repositories), a production build, and a Playwright smoke test on every pull request.",
    tech: [
      "React 18",
      "TypeScript 5",
      "Vite",
      "Tailwind CSS",
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
      "Woodcut design system: ten colour tokens and three self-hosted typefaces",
      "CSS-only motion that respects reduced-motion settings",
      "Project facts synced from GitHub through a review pull request",
      "Contact form with per-IP rate limiting and a honeypot field",
      "Zod validation on the client and in the Vercel Function",
      "CI: ESLint, type-check, Vitest, build and Playwright smoke test",
    ],
    // This repository is the sync target. Leaving it unmapped avoids a loop.
    github: "https://github.com/gunnarwrld/PersonalPortfolio",
    live: "https://gunnarwrld.com/",
    role: "Solo Developer",
    timeline: "2026, ongoing",
    status: "Live",
  },
  {
    id: "smart-home-gitops",
    title: "Smart Home GitOps",
    subtitle: "Android GitOps Monitor (coursework)",
    description:
      "Course prototype: an Android app that polls a GitOps repository, flags manipulative pull-request comments with a rule-based score, and lets an operator merge or reject the change from the phone.",
    longDescription:
      "Built for a course scenario: a smart home managed as configuration in a GitHub repository, where one bot proposes energy-saving changes through pull requests and another posts misleading comments to push the operator into rejecting them. The app polls the repository every 30 seconds and scores each comment with a weighted, seven-category set of text rules (for example HVAC-failure language, direct blocking commands and artificial urgency); a score of 40% or more raises an alert. The score is a heuristic, not a calibrated probability. The detector is a pure Kotlin domain object with no Android dependencies. The app uses MVVM with StateFlow for UI state and SharedFlow for one-shot events. On Force Merge it reads the file's blob SHA, edits the JSON, writes it to main with PUT /contents, then closes the pull request with PATCH /pulls. Those are two separate API calls, not an atomic merge: if the second call fails, the file is already changed and the pull request stays open.",
    tech: [
      "Kotlin",
      "Jetpack Compose",
      "MVVM",
      "Kotlin Coroutines",
      "StateFlow",
      "Retrofit 2",
      "OkHttp 4",
      "GitHub REST API",
    ],
    features: [
      "Rule-based comment scoring that runs on the device",
      "Force Merge: write the config file to main, then close the pull request",
      "MVVM with a one-way dependency rule (UI → ViewModel → Repository → API)",
      "30-second polling loop with StateFlow-driven state changes",
      "Per-status HTTP error handling and a double-submit guard",
    ],
    repo: "gunnarwrld/smart-home-gitops",
    github: "https://github.com/gunnarwrld/smart-home-gitops",
    role: "Solo Developer",
    timeline: "2026",
    status: "Coursework",
    limits:
      "The GitHub token is compiled into the app, so anyone with the APK can extract it. Use it only with a disposable test repository and a least-privilege token.",
  },
  {
    id: "posthub",
    title: "PostHub",
    subtitle: "Dynamic Single Page Application",
    description:
      "Responsive blogging SPA in vanilla JavaScript, with no framework, that loads DummyJSON posts with client-side user caching, hash routing, and a Load More list.",
    longDescription:
      "index.html, style.css, and script.js. Posts, comments, and author profiles come from the DummyJSON REST API. User records are cached on a plain appData object so a profile is not fetched twice. The list grows through a Load More button (setupLoadMoreButton / loadMorePosts). Hash routing and modals are in the same script. Mobile-first CSS.",
    tech: ["Vanilla JavaScript", "HTML5", "CSS3", "REST APIs"],
    features: [
      "Post list that grows with a Load More button",
      "Post details, comments, and author profile modals",
      "In-memory cache for user profiles",
      "Hash routing without a framework",
      "Mobile-first layout",
    ],
    repo: "gunnarwrld/PostHub-DynamicWebsite",
    github: "https://github.com/gunnarwrld/PostHub-DynamicWebsite",
    live: "https://post-hub-dynamic-website.vercel.app/",
    role: "Frontend Developer",
    timeline: "2025",
    status: "Learning project",
    limits: "The contact form is UI-only: it shows a confirmation but sends nothing.",
  },
  {
    id: "matchday-hub",
    title: "Matchday Hub",
    subtitle: "Team-sport match API",
    description:
      "ASP.NET Core 10 API that stores fixtures and live match events in PostgreSQL, streams them with SignalR, and serves team form and player load. It runs locally, with a fake aggregator by default.",
    longDescription:
      "A .NET 10 companion to the Fútbol Data Aggregator. MatchPoller enqueues events on a bounded in-process channel (IEventQueue). IngestionProcessor upserts them in one transaction, treats a repeat as a no-op with a ProcessedMessage row and a unique index on UpstreamEventId, then broadcasts matchEvent and scoreUpdate to a SignalR group for that match. Minimal APIs under /v1 return RFC 9457 problem details, limit traffic to 100 requests a minute per IP, and cache team form for 30 seconds. When a Redis connection string is set, that cache and the SignalR backplane use Redis. EF Core 10 and Npgsql store the matches. The checked-in config sets Aggregator:UseFake, so docker compose plus the API seeds a season and one live match without the Node service. xUnit covers team-form maths, player-load aggregation, and ingestion idempotency. Integration tests boot the API with WebApplicationFactory against Testcontainers PostgreSQL. GitHub Actions runs dotnet format, the build, and the tests.",
    tech: [
      "C#",
      ".NET 10",
      "ASP.NET Core",
      "EF Core",
      "PostgreSQL",
      "Redis",
      "SignalR",
      "Docker Compose",
      "xUnit",
      "Testcontainers",
      "GitHub Actions",
    ],
    features: [
      "Versioned /v1 routes for matches, events, team form, and player load",
      "Idempotent ingestion with a processed-message ledger and a unique upstream event id",
      "SignalR groups that push match events and score updates",
      "Redis output cache on team form when Redis is configured",
      "Fake aggregator so the local demo runs without the Node API",
      "xUnit and Testcontainers tests in GitHub Actions",
    ],
    repo: "gunnarwrld/matchday-hub",
    github: "https://github.com/gunnarwrld/matchday-hub",
    role: "Solo Developer",
    timeline: "2026",
    status: "Local demo",
    limits:
      "It runs on your machine. Azure deploy is still on the roadmap, and the queue is an in-process channel. Player-load figures are seeded demo data: the aggregator has no player-stats model.",
  },
  {
    id: "forge-wallet",
    title: "Forge Wallet",
    subtitle: "Offline-first Android wallet",
    description:
      "Android client for Ledger Forge. A send is written to a Room outbox and posted later with the same Idempotency-Key, including after airplane mode and process death.",
    longDescription:
      "Kotlin wallet on Ledger Forge. SendMoney checks funds and inserts the outbox row in one transaction, and the available balance drops at once. WorkManager posts that row to POST /transfers with its Idempotency-Key once a network is back, including after the process is killed. Ledger Forge applies the key at most once, so a lost response does not move the money twice. feature:home and feature:send are Jetpack Compose screens over a pure domain module, Room, and Retrofit. Amounts are Long minor units. ExactlyOnceChaosTest runs 200 faulted sends on the JVM. GitHub Actions runs ktlint, detekt, Android Lint, JVM and Robolectric unit tests, and assembles a debug APK. scripts/verify_exactly_once.sh checks three emulator scenarios against a local Ledger Forge database, including a response dropped after the ledger commits.",
    tech: [
      "Kotlin",
      "Jetpack Compose",
      "Material 3",
      "Navigation 3",
      "Hilt",
      "Room",
      "WorkManager",
      "Retrofit",
      "OkHttp",
      "GitHub Actions",
    ],
    features: [
      "Room outbox so a send survives airplane mode and process death",
      "Idempotency-Key replay against Ledger Forge",
      "WorkManager sync when the network returns",
      "Money as Long minor units with ISO 4217 exponents",
      "JVM, Robolectric, and MockWebServer tests",
      "CI with ktlint, detekt, and Android Lint",
    ],
    repo: "gunnarwrld/forge-wallet-android",
    github: "https://github.com/gunnarwrld/forge-wallet-android",
    role: "Solo Developer",
    timeline: "2026",
    status: "Local demo",
    limits:
      "Synthetic money against a local Ledger Forge. The payment path works with a minimal UI. The fuller send flow, biometric step-up, and design system are still ahead. The recorded checks ran on an emulator, not a physical device.",
  },
  {
    id: "ledger-sentinel",
    title: "Ledger Sentinel",
    subtitle: "Double-entry payments lab",
    description:
      "Java 21 ledger for synthetic account transfers: balanced journals, idempotent POSTs, and row locks, with Spock tests against PostgreSQL. No machine-learning code is in this repository yet.",
    longDescription:
      "Spark Java HTTP API. The code and docs use the name payments-lab. jOOQ talks to PostgreSQL, and those classes are generated from the Flyway migrations on a real database. HikariCP pools connections. Every /v1 route needs an API key, and the server stores a SHA-256 hash. POST requires an Idempotency-Key, and a declined transfer is stored so the same key replays the decline. A transfer writes a balancing entry and an outbox row in one transaction. An operator can reverse a posted transfer. A second reversal, or a reversal of a declined transfer, returns 409. Integration tests use Testcontainers for PostgreSQL 18 and Redis 8 and a real Jetty server. LedgerModelSpec checks 50 seeds of 200 random operations against an in-memory model. Redis is pinged on readiness and a down Redis does not fail that check. docker compose starts PostgreSQL 18 and Redis 8 for a local run.",
    tech: [
      "Java 21",
      "Spark Java",
      "jOOQ",
      "Flyway",
      "PostgreSQL",
      "HikariCP",
      "Redis",
      "Lettuce",
      "Testcontainers",
      "Spock",
      "Docker Compose",
    ],
    features: [
      "Double-entry journals and operator reversals",
      "Idempotency-Key on POST, including a stored decline",
      "API keys stored as SHA-256 hashes, with customer and operator roles",
      "Outbox rows written in the transfer transaction",
      "Spock integration tests on PostgreSQL 18 via Testcontainers",
      "Model-based runs checked against an in-memory ledger",
    ],
    repo: "gunnarwrld/ledger-sentinel-ai",
    github: "https://github.com/gunnarwrld/ledger-sentinel-ai",
    role: "Solo Developer",
    timeline: "2026",
    status: "Local demo",
    limits:
      "Phases 1 and 2 of 6 are in the tree. The outbox relay and fraud rules are still planned, and the repository has no machine-learning code. Synthetic data only. Run it with Docker Compose. It is not deployed.",
  },
  {
    id: "fair-football-fee",
    title: "Fair Football Fee",
    subtitle: "Player valuation model",
    description:
      "Python pipeline that builds point-in-time features for Premier League players and trains an XGBoost model of Transfermarkt valuations. The target is a crowd-sourced valuation, not a negotiated transfer fee.",
    longDescription:
      "On main: a dataset audit, Parquet ingestion, cleaning, and point-in-time features in DuckDB and Pandas, a PostgreSQL serving schema through SQLAlchemy 2 and Alembic, and the phase-3 trainer. The target is a Transfermarkt crowd-sourced valuation, not a negotiated transfer fee. The modeling population is Premier League players with at least 450 tracked minutes in the prior 12 months, and a valuation club corroborated by match data. src/ml/train.py fits a position-and-age median, Ridge, LightGBM, and XGBoost, tunes XGBoost with Optuna on expanding windows inside the training seasons, and writes artifacts/v1.0.0. pytest covers the schema, ingestion, the population rule, and the metric helpers, and test_leakage.py rejects features that read data from after the valuation date. Raw datasets are downloaded at runtime and are not committed.",
    tech: [
      "Python",
      "DuckDB",
      "Pandas",
      "PostgreSQL",
      "SQLAlchemy",
      "Alembic",
      "scikit-learn",
      "XGBoost",
      "LightGBM",
      "Optuna",
      "pytest",
    ],
    features: [
      "Point-in-time features with tests that reject data from after the valuation date",
      "Premier League population with a 450-minute minimum",
      "Median, Ridge, LightGBM, and Optuna-tuned XGBoost in one training entrypoint",
      "Held-out season written to artifacts/v1.0.0",
      "PostgreSQL schema and Alembic migrations",
      "pytest for the schema, ingestion, features, population, and model layer",
    ],
    repo: "gunnarwrld/fair-football-fee",
    github: "https://github.com/gunnarwrld/fair-football-fee",
    role: "Solo Developer",
    timeline: "2026",
    status: "Local demo",
    limits:
      "The training pipeline and its tests are on main. The HTTP service, explanations, and web UI are open pull requests. This checkout has no Dockerfile and no CI workflow. docker compose starts PostgreSQL and Redis; its app and frontend profiles refer to files that are not in the tree. The pipeline does not read Redis.",
  },
];
