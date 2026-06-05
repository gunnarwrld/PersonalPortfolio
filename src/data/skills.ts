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
    ],
  },
  {
    category: "Backend",
    skills: [
      "Node.js",
      "Express 5",
      "TypeScript",
      "REST API Design",
      "JWT",
      "bcryptjs",
      "Zod",
      "Python",
      "FastAPI",
    ],
  },
  {
    category: "Databases",
    skills: [
      "PostgreSQL",
      "Prisma ORM",
      "Supabase",
      "MongoDB",
      "Firebase",
      "MySQL",
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
      "Docker",
      "ESM/CJS Module Resolution",
    ],
  },
  {
    category: "AI & ML",
    skills: [
      "Llama 3.3",
      "Workers AI",
      "OpenAI API",
      "Prompt Engineering",
      "LangChain",
      "Conversational AI",
    ],
  },
];
