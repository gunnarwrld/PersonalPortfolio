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
    id: "portfolio",
    title: "Personal Portfolio",
    subtitle: "Developer Portfolio Website",
    description: "A modern, responsive portfolio website built with React and TypeScript showcasing projects, skills, and professional experience.",
    longDescription: "A fully responsive personal portfolio featuring smooth animations, dark theme, glassmorphism design, and a contact form. Built to demonstrate front-end expertise and serve as a professional landing page.",
    tech: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    features: [
      "Responsive design for all screen sizes",
      "Smooth scroll-triggered animations",
      "Dark theme with glassmorphism cards",
      "Contact form with validation",
      "Project showcase with detail modals",
    ],
    github: "https://github.com/gunnarwrld/PersonalPortfolio",
    live: "https://gunnarwrld.com/",
    role: "Solo Developer",
    timeline: "2026 — ongoing",
  },
  {
    id: "financetracker",
    title: "FinanceTracker",
    subtitle: "Personal Finance Management",
    description: "A comprehensive personal finance management application with expense tracking, budget planning, and visual analytics.",
    longDescription: "Full-stack finance management app enabling users to track expenses, set budgets, and visualize spending patterns through interactive charts. Features secure authentication and real-time data sync.",
    tech: ["React", "Node.js", "MongoDB", "Chart.js", "Express"],
    features: [
      "Expense tracking with categories",
      "Budget planning and alerts",
      "Interactive spending analytics",
      "Secure user authentication",
      "CSV export functionality",
    ],
    github: "https://github.com/gunnarwrld/personal-finance-web-app",
    live: "https://personal-finance-web-app-psi.vercel.app/",
    role: "Full-Stack Developer",
    timeline: "2025",
  },
  {
    id: "posthub",
    title: "PostHub",
    subtitle: "Social Content Platform",
    description: "A social media-inspired platform for sharing and discovering posts with real-time interactions and user profiles.",
    longDescription: "A community-driven content platform where users can create, share, and engage with posts. Features real-time updates, user profiles, and a responsive feed algorithm.",
    tech: ["React", "Firebase", "Tailwind CSS", "Node.js"],
    features: [
      "Real-time post feed",
      "User profiles and authentication",
      "Like and comment system",
      "Image upload support",
      "Responsive mobile-first design",
    ],
    github: "https://github.com/gunnarwrld/PostHub-DynamicWebsite",
    live: "https://post-hub-dynamic-website.vercel.app/",
    role: "Full-Stack Developer",
    timeline: "2024",
  },
  {
    id: "ai-study-assistant",
    title: "AI Study Assistant",
    subtitle: "Edge AI Learning Tool",
    description: "An AI-powered study companion running on Cloudflare's edge network, generating flashcards, quizzes, and summaries from any uploaded material.",
    longDescription: "A serverless AI study assistant built entirely on Cloudflare's edge stack. Uses Workers AI with Llama 3.3 for inference, Durable Objects for per-session state, and Workflows to orchestrate multi-step generation. Submitted to the Cloudflare AI Challenge.",
    tech: ["Cloudflare Workers", "Workers AI", "Llama 3.3", "Durable Objects", "TypeScript", "React"],
    features: [
      "AI-generated flashcards from notes",
      "Adaptive quiz generation",
      "Text summarization",
      "Streaming responses via Workers AI",
      "Stateful sessions via Durable Objects",
    ],
    github: "https://github.com/gunnarwrld/cf_ai_study_assistant",
    live: "https://cf-ai-study-assistant.pages.dev/",
    role: "Solo Developer",
    timeline: "2025",
  },
];
