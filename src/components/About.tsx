import { MascotBadge } from "@/components/Mascot";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

const facts = [
  { label: "Based in", value: site.location },
  { label: "Studying", value: "Computer Science, graduating June 2027" },
  { label: "Focus", value: "Backend: Node and TypeScript" },
  { label: "Projects built", value: String(projects.length) },
];

const paragraphs = [
  "Backend-leaning full-stack developer and Computer Science student based in Kristianstad, Sweden. I build REST APIs, edge workers, and Android apps. The projects below are the ones with code behind them — some are deployed, and others are local services with tests you can run from the repository.",
  "Most recently I worked on the backend of a sports union platform with a student team: I built the JWT authentication and the four-level role hierarchy, set up the Vitest + Supertest integration tests, and fixed the build so the API runs on Railway. I'm as comfortable reasoning about a Prisma migration failure in a Railway CI pipeline as I am tuning the easing on a button press.",
  "Outside of coursework I follow edge computing and AI inference closely. The AI Study Assistant runs Llama 3.3 on Cloudflare Workers AI, and a Durable Object keeps each study session's chat history in SQLite. If there's a new Workers primitive or a model I haven't run yet, I'm already reading the docs.",
];

const About = () => {
  return (
    <section id="about" aria-labelledby="about-title" className="py-20 sm:py-28">
      <div className="container">
        <SectionHeading id="about" title="About" say="The short version of me." />

        <div className="grid items-start gap-x-12 gap-y-12 lg:grid-cols-[1.4fr_1fr]">
          <Reveal className="ink-panel p-6 sm:p-9">
            <div className="max-w-[66ch] space-y-5 text-[1.0625rem] leading-[1.7] text-parchment">
              {paragraphs.map((text, i) => (
                <p key={i} className={i === 0 ? "text-ivory" : undefined}>
                  {text}
                </p>
              ))}
            </div>
          </Reveal>

          {/* The facts, typed on an index card. */}
          <Reveal className="paper p-6 sm:p-8 lg:rotate-1" delay={120}>
            <div className="flex items-center gap-3 border-b-[3px] border-double border-espresso pb-4">
              <MascotBadge size={52} />
              <p className="font-display text-2xl uppercase leading-none">{site.name}</p>
            </div>
            <dl className="typed">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="grid grid-cols-[8.5rem_1fr] gap-3 border-b border-dashed border-espresso/50 py-3 last:border-b-0 last:pb-0"
                >
                  <dt className="font-bold">{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default About;
