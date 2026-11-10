import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { skillGroups } from "@/data/skills";

// A comic page: six panels in three rows, no two rows cut the same way.
const PANEL_SPAN = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7", "lg:col-span-8", "lg:col-span-4"];

const Skills = () => {
  return (
    <section id="skills" aria-labelledby="skills-title" className="py-20 sm:py-28">
      <div className="container">
        <SectionHeading id="skills" title="Skills" say="The tools I've built with." />

        <div className="grid gap-x-7 gap-y-8 md:grid-cols-2 lg:grid-cols-12">
          {skillGroups.map((group, i) => (
            <Reveal
              key={group.category}
              className={`ink-panel p-6 sm:p-7 ${PANEL_SPAN[i % PANEL_SPAN.length]}`}
              delay={(i % 2) * 110}
            >
              <h3 className="font-display text-2xl uppercase leading-none">{group.category}</h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <li key={skill} className="chip">
                    {skill}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
