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
    id: "financetracker",
    title: "FinanceTracker",
    subtitle: "Personal Finance PWA",
    description:
      "Built a multi-currency personal finance PWA with Stripe billing, Supabase RLS, and Groq AI spending insights — supporting free and premium tiers with real billing and data isolation.",
    longDescription:
      "Delivered a cross-platform personal finance PWA in React and TypeScript, tracking multi-account and multi-currency budgets using Supabase for authentication, PostgreSQL storage, and Row-Level Security policies that enforce user-scoped data isolation at the database layer. Integrated Stripe Checkout and Customer Portal to handle premium subscription upgrades, with Edge Functions and SQL migrations keeping billing state and user access in sync across tier changes. Added AI-powered spending insights using Groq models on top of transaction history, typed via Zod schemas and fetched through React Query — keeping the UI responsive and resilient against inference latency spikes. Implemented offline-first service workers for cross-device sync and a 40% improvement in load times, with live exchange-rate conversion and analytics dashboards rounding out the full-stack feature set.",
    tech: [
      "React",
      "TypeScript",
      "Supabase",
      "PostgreSQL",
      "Supabase Edge Functions",
      "Stripe",
      "Groq AI",
      "Zod",
      "React Query",
      "PWA",
      "Service Workers",
    ],
    features: [
      "Multi-account and multi-currency support with live exchange rates",
      "Stripe Checkout and Customer Portal for free-to-premium upgrades",
      "Supabase RLS policies enforce per-user data isolation at DB layer",
      "Groq AI spending insights typed with Zod and fetched via React Query",
      "40% faster load times via offline-first service workers",
      "Google OAuth and Supabase Auth with full session management",
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
      "Built a globally distributed AI study assistant on Cloudflare Workers: Durable Objects for stateful per-user sessions, Llama 3.3 inference, and both REST and WebSocket APIs with documented message contracts.",
    longDescription:
      "Deployed a globally distributed AI chatbot on Cloudflare's edge network, running Meta's Llama 3.3 (70B) via Workers AI for context-aware study conversations. Cut round-trip latency to under 50ms by routing WebSocket sessions through Durable Objects, maintaining stateful per-user conversation history in SQLite at the edge across 300+ global locations. Exposed both REST and WebSocket APIs for chat, history retrieval, and search, and documented message types, JSON response formats, and error states to make the backend easy for other clients to consume. Deployed a production-ready pipeline with automated CI/CD, structured error handling, and 99.9% uptime from day one — and submitted the project to the Cloudflare AI Challenge.",
    tech: [
      "Cloudflare Workers",
      "Workers AI",
      "Llama 3.3",
      "Durable Objects",
      "SQLite",
      "WebSockets",
      "TypeScript",
      "React",
    ],
    features: [
      "Stateful per-user sessions via Durable Objects + SQLite at the edge",
      "REST and WebSocket APIs with fully documented message contracts",
      "Sub-50ms latency across 300+ global Cloudflare edge locations",
      "Llama 3.3 (70B) inference via Workers AI for context-aware responses",
      "Streaming responses and persistent conversation history",
      "99.9% uptime with automated CI/CD pipeline",
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
      "A modern responsive blogging SPA built in vanilla JavaScript — no frameworks — with a 35% render efficiency gain via DOM batching, lazy loading, and intelligent data caching.",
    longDescription:
      "Built in vanilla JavaScript with zero frameworks — demonstrating deep DOM API knowledge. Achieved a 35% improvement in render efficiency via DOM batching, script deferral, lazy loading, and mobile-first responsive design. Implements intelligent data caching, infinite scrolling, and comprehensive error handling without any framework abstraction.",
    tech: ["Vanilla JavaScript", "HTML5", "CSS3", "REST APIs"],
    features: [
      "35% render efficiency improvement via DOM batching",
      "Real-time data fetching with intelligent caching",
      "Lazy loading and script deferral",
      "Infinite scrolling",
      "Mobile-first responsive design",
    ],
    github: "https://github.com/gunnarwrld/PostHub-DynamicWebsite",
    live: "https://post-hub-dynamic-website.vercel.app/",
    role: "Frontend Developer",
    timeline: "2024",
  },
];
