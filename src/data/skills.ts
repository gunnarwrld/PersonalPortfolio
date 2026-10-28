export interface SkillGroup {
  category: string;
  skills: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    category: "Frontend",
    skills: [
      "React 18",
      "TypeScript",
      "JavaScript (ES6+)",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "Framer Motion",
      "shadcn/ui",
      "Radix UI",
      "React Hook Form",
      "Next.js",
      "Vite",
      "Jetpack Compose",
    ],
  },
  {
    category: "Backend",
    skills: [
      "Node.js",
      "Express 5",
      "REST API Design",
      "JWT",
      "bcryptjs",
      "Zod",
      "Python",
      "FastAPI",
      "Kotlin",
      "Spring Boot",
      "BullMQ",
      "Socket.io",
    ],
  },
  {
    category: "Databases",
    skills: [
      "PostgreSQL",
      "Prisma ORM",
      "Supabase",
      "MongoDB",
      "Redis",
    ],
  },
  {
    category: "Testing",
    skills: [
      "Vitest",
      "Supertest",
      "Playwright",
      "Testing Library",
      "Integration Testing",
      "End-to-End Testing",
    ],
  },
  {
    category: "Cloud & DevOps",
    skills: [
      "Vercel",
      "Railway",
      "Cloudflare Workers",
      "Durable Objects",
      "Git",
      "GitHub Actions",
      "CI/CD",
      "Docker Compose",
      "ESM/CJS Module Resolution",
    ],
  },
  {
    category: "AI & ML",
    skills: [
      "Llama 3.3",
      "Workers AI",
      "Groq",
      "Prompt Engineering",
      "Conversational AI",
    ],
  },
];

/** Tech names in the homepage marquee. Kept next to the skill matrix so both stay in sync. */
export const marqueeItems = [
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Node.js",
  "PostgreSQL",
  "Python",
  "Docker Compose",
  "Supabase",
  "Git",
  "REST APIs",
  "AI/ML",
];
