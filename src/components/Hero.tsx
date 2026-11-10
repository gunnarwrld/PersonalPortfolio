import { useCallback, useState, type CSSProperties } from "react";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Mascot, MascotRig, type MascotMove } from "@/components/Mascot";
import { Spotlight } from "@/components/Spotlight";
import { SpeechBubble } from "@/components/SpeechBubble";
import { site } from "@/data/site";

/** Start time of each step of the entrance, in seconds. The keyframes are in src/index.css. */
const at = (seconds: number) => ({ "--at": `${seconds}s` }) as CSSProperties;

const Hero = () => {
  const [move, setMove] = useState<MascotMove>("enter");
  const backToIdle = useCallback(() => setMove("idle"), []);

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative overflow-hidden pb-16 pt-24 sm:pb-20 sm:pt-32 lg:flex lg:min-h-[100svh] lg:items-center lg:pb-24"
    >
      <div aria-hidden="true" className="halftone fade-up pointer-events-none absolute inset-x-0 bottom-0 h-2/5" />

      <div className="container relative grid items-center gap-y-9 sm:gap-y-12 lg:grid-cols-[5fr_7fr] lg:gap-x-10">
        {/* The star, on the left: it faces right, toward the name and the buttons. */}
        <div
          // Sized so that on a phone the star, the name and both buttons share the first screen.
          className="relative mx-auto w-[min(46vw,16rem)] lg:w-full lg:max-w-[25rem]"
          onPointerEnter={() => setMove((current) => (current === "idle" ? "hello" : current))}
        >
          <Spotlight />
          <MascotRig move={move} delay={0.2} onDone={backToIdle} className="relative">
            <Mascot
              priority
              alt="Gunnar's mascot: an orange star in a black cap and sunglasses, holding a thermos and a mate."
            />
          </MascotRig>
        </div>

        <div className="relative flex flex-col items-center text-center [container-type:inline-size] lg:items-start lg:text-left">
          <SpeechBubble tail="hero" className="hero-pop" style={at(0.85)}>
            Hi! I build the parts you don&apos;t see: APIs, auth, tests and deploys.
          </SpeechBubble>

          <h1 id="hero-title" className="masthead mt-6 sm:mt-7">
            <span className="masthead-line hero-ink mx-auto lg:mx-0" style={at(0.15)}>
              <span aria-hidden="true" className="masthead-shade">
                Gunnar
              </span>
              Gunnar
            </span>{" "}
            <span className="masthead-line hero-ink mx-auto lg:mx-0" style={at(0.3)}>
              <span aria-hidden="true" className="masthead-shade">
                Arias
              </span>
              Arias
            </span>
          </h1>

          <p className="hero-ink mt-5 max-w-[34rem] text-base leading-relaxed text-parchment [text-wrap:balance] sm:mt-7 sm:text-xl" style={at(0.5)}>
            Full-stack developer, backend first. Computer Science student in {site.location}.
          </p>

          <div className="mt-7 flex flex-col items-center gap-4 sm:mt-9 sm:flex-row sm:gap-5">
            <Button variant="cta" asChild className="hero-stamp sm:btn-xl" style={at(0.8)}>
              <a href="#projects">View projects</a>
            </Button>
            <Button variant="ink" asChild className="hero-stamp sm:btn-xl" style={at(0.9)}>
              <a href={site.github} target="_blank" rel="noopener noreferrer">
                <Github aria-hidden="true" />
                GitHub
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
