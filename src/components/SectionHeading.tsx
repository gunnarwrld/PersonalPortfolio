import { MascotBadge } from "@/components/Mascot";
import { Reveal } from "@/components/Reveal";
import { SpeechBubble } from "@/components/SpeechBubble";

interface SectionHeadingProps {
  /** Section id; the heading gets `${id}-title` for aria-labelledby. */
  id: string;
  /** The plain section name. Must match the nav label. */
  title: string;
  /** The mascot's one-line introduction. */
  say: string;
}

export function SectionHeading({ id, title, say }: SectionHeadingProps) {
  return (
    <Reveal as="header" className="mb-10 sm:mb-14">
      <div className="flex items-end gap-4">
        <MascotBadge size={48} />
        <SpeechBubble tail="left">{say}</SpeechBubble>
      </div>
      <h2 id={`${id}-title`} className="mt-6 font-display text-[clamp(2.5rem,7vw,4.75rem)] uppercase leading-none">
        {title}
      </h2>
    </Reveal>
  );
}
