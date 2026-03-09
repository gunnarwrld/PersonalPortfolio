export interface SkillGroup {
  category: string;
  skills: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    category: "Frontend",
    skills: ["React", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Next.js"],
  },
  {
    category: "Backend",
    skills: ["Node.js", "Express", "FastAPI", "Python", "REST APIs"],
  },
  {
    category: "Databases",
    skills: ["MongoDB", "PostgreSQL", "Firebase", "Supabase"],
  },
  {
    category: "Tools & Cloud",
    skills: ["Git", "GitHub", "Vercel", "Docker", "VS Code", "Figma"],
  },
  {
    category: "AI & ML",
    skills: ["OpenAI API", "Prompt Engineering", "LangChain"],
  },
];
