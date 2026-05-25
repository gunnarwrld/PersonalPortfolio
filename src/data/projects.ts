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
      "A full-stack platform for a university sports union — role-based member management, activity scheduling, and an admin dashboard, backed by a production REST API deployed on Railway.",
    longDescription:
      "Architected the entire backend from scratch: Express 5 + TypeScript REST API with a typed ApiError factory, ApiResponse<T> response shapes, and asyncHandler boundary middleware. Designed and migrated a PostgreSQL schema through multiple iterations using Prisma ORM — adding conflict-detection fields, capacity constraints, and role enumerations. Built a complete JWT auth system with bcrypt hashing, a unified authMiddleware + restrictToMinRole role hierarchy (MEMBER / LEADER / BOARD_MEMBER / ADMIN), and DTO projection to prevent credential exposure. Resolved Railway deployment failures end-to-end: ESM module resolution, Prisma 7 config split, and build script ordering. Established the full Vitest + Supertest integration test suite covering auth, activities, participations, and favorites.",
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
      "Role-based access control with 4-tier hierarchy",
      "JWT authentication with DTO projection (no password leakage)",
      "Activity scheduling with conflict detection and capacity limits",
      "Admin dashboard aggregation endpoints",
      "Integration test suite with Vitest + Supertest",
      "Production deployment on Railway with CI build pipeline",
    ],
    github: "https://github.com/jasminerezai/hkif-web",
    live: "https://hkif-web.vercel.app/",
    role: "Backend Lead",
    timeline: "2025",
  },
  {
    id: "portfolio",
    title: "Personal Portfolio",
    subtitle: "Developer Portfolio Website",
    description:
      "A motion-first single-page portfolio with scroll-linked Framer Motion animations, a serverless contact form, and a full Vitest + Playwright test suite — deployed on Vercel.",
    longDescription:
      "Built with React 18 + TypeScript 5 + Vite + SWC for a fast dev loop and strict types. Features scroll-linked Framer Motion parallax, spring physics, and 3D card reveals on a glass UI aesthetic with a Syne/Inter/JetBrains Mono type stack. The contact form runs on a Vercel serverless function (Node 20) with React Hook Form + Zod dual validation, per-IP rate limiting, a honeypot, and transactional email via Resend. Testing is covered end-to-end with Vitest + Testing Library for unit tests and Playwright for E2E, integrated into a GitHub Actions CI workflow.",
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
      "Serverless contact form with dual Zod validation",
      "Per-IP rate limiting and honeypot spam protection",
      "Vitest unit tests and Playwright E2E suite",
      "GitHub Actions CI with ESLint flat config",
    ],
    github: "https://github.com/gunnarwrld/PersonalPortfolio",
    live: "https://gunnarwrld.com/",
    role: "Solo Developer",
    timeline: "2025 — ongoing",
  },
  {
    id: "ai-study-assistant",
    title: "AI Study Assistant",
    subtitle: "Edge AI Learning Tool",
    description:
      "An AI-powered study companion running on Cloudflare's edge network, generating flashcards, quizzes, and summaries from any uploaded material.",
    longDescription:
      "A serverless AI study assistant built entirely on Cloudflare's edge stack. Uses Workers AI with Llama 3.3 (70B) for inference, Durable Objects for per-session stateful context, and real-time WebSocket communication achieving sub-50ms latency across 300+ global edge locations. Submitted to the Cloudflare AI Challenge.",
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
      "AI-generated flashcards from notes",
      "Adaptive quiz generation",
      "Text summarization",
      "Streaming responses via Workers AI",
      "Stateful sessions via Durable Objects",
      "Sub-50ms latency across 300+ edge locations",
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
      "A secure, cross-platform personal finance management PWA with multi-account support, live currency conversion, and offline-first service workers.",
    longDescription:
      "Full-stack finance management app with Google OAuth, Supabase real-time database, and live currency conversion APIs. Implemented as an offline-first PWA with service workers delivering 40% faster load times and seamless cross-device sync. Features advanced analytics dashboards and a responsive UI built for all device types.",
    tech: ["React", "TypeScript", "Supabase", "Google OAuth 2.0", "PWA", "Service Workers"],
    features: [
      "Multi-account and multi-currency support",
      "Offline-first PWA with service workers",
      "Live currency conversion APIs",
      "Google OAuth authentication",
      "Advanced analytics dashboards",
      "40% faster load times via PWA caching",
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
      "A modern responsive blogging SPA with real-time data fetching, dynamic content management, and 35% improved render efficiency via DOM optimization.",
    longDescription:
      "Built in vanilla JavaScript with zero frameworks — demonstrating deep DOM API knowledge. Achieved 35% improved render efficiency via DOM batching, script deferral, lazy loading, and mobile-first responsive design. Implements intelligent data caching and comprehensive error handling.",
    tech: ["Vanilla JavaScript", "HTML5", "CSS3", "REST APIs"],
    features: [
      "Real-time data fetching with caching",
      "35% render efficiency improvement",
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
