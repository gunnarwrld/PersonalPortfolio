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
    id: "hkif-web",
    title: "HKIF Website",
    subtitle: "Sports Union Platform",
    description:
      "Production REST API for a university sports union — 4-tier RBAC, activity scheduling with conflict detection, and a full Vitest + Supertest integration suite, deployed on Railway.",
    longDescription:
      "Architected the entire backend from zero using Node.js, Express 5, and TypeScript — establishing a typed ApiError factory, ApiResponse<T> envelope, and asyncHandler boundary before any feature work began, giving every route a consistent, testable error contract. Designed a relational PostgreSQL schema via Prisma ORM with conflict-detection fields, capacity constraints, and role enumerations; resolved a blocking Prisma 7 migration by introducing a custom prisma.config.ts adapter split and correcting client generation order in the Railway CI pipeline. Secured the API with JWT authentication, bcrypt password hashing, and a 4-tier RBAC system (MEMBER / LEADER / BOARD_MEMBER / ADMIN), enforced through a unified authMiddleware + restrictToMinRole chain with DTO projection to guarantee zero credential leakage. Built the integration test suite from scratch with Vitest and Supertest, covering auth, activity, participation, and favorites flows with shared setup/teardown helpers — reaching full endpoint coverage before the first production deploy.",
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
      "Admin dashboard aggregation endpoints",
      "Integration test suite built from zero with Vitest + Supertest",
      "Railway deployment unblocked by resolving Prisma 7 config split",
    ],
    github: "https://github.com/jasminerezai/hkif-web",
    live: "https://hkif-web.vercel.app/",
    role: "Backend Lead",
    timeline: "2026",
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
    id: "ai-study-assistant",
    title: "AI Study Assistant",
    subtitle: "Edge AI Learning Tool",
    description:
      "A globally distributed AI study companion deployed on Cloudflare's edge network — sub-50ms latency across 300+ locations, stateful sessions via Durable Objects, and Llama 3.3 (70B) inference.",
    longDescription:
      "Deployed a globally distributed AI chatbot on Cloudflare's edge network, running Meta's Llama 3.3 (70B) via Workers AI for context-aware study conversations. Cut round-trip latency to under 50ms by routing WebSocket sessions through Durable Objects for stateful, per-user session management at the edge across 300+ global locations. Shipped a production-ready deployment pipeline with automated CI/CD, structured error handling, and 99.9% uptime from day one. Submitted to the Cloudflare AI Challenge.",
    tech: [
      "Cloudflare Workers",
      "Workers AI",
      "Llama 3.3",
      "Durable Objects",
      "WebSockets",
      "TypeScript",
      "React",
    ],
    features: [
      "AI-generated flashcards, quizzes, and summaries from notes",
      "Sub-50ms latency across 300+ global edge locations",
      "Stateful sessions via Durable Objects",
      "Streaming responses via Workers AI",
      "99.9% uptime with automated CI/CD pipeline",
    ],
    github: "https://github.com/gunnarwrld/cf_ai_study_assistant",
    live: "https://cf-ai-study-assistant.pages.dev/",
    role: "Solo Developer",
    timeline: "2025",
  },
  {
    id: "financetracker",
    title: "FinanceTracker",
    subtitle: "Personal Finance PWA",
    description:
      "Cross-platform personal finance PWA with multi-account and multi-currency support, Google OAuth, Supabase real-time sync, and a 40% load time improvement via offline-first service workers.",
    longDescription:
      "Delivered a cross-platform personal finance PWA with multi-account, multi-currency support, Google OAuth, Supabase real-time sync, live exchange-rate conversion, and analytics dashboards. Reduced load time by 40% by implementing an offline-first service worker architecture, enabling seamless cross-device sync without a network connection.",
    tech: ["React", "TypeScript", "Supabase", "Google OAuth 2.0", "PWA", "Service Workers"],
    features: [
      "Multi-account and multi-currency support",
      "40% faster load times via offline-first service workers",
      "Seamless cross-device sync without network",
      "Live currency conversion APIs",
      "Google OAuth authentication",
      "Advanced analytics dashboards",
    ],
    github: "https://github.com/gunnarwrld/personal-finance-web-app",
    live: "https://personal-finance-web-app-psi.vercel.app/",
    role: "Full-Stack Developer",
    timeline: "2025",
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
