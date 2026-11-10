import { Button } from "@/components/ui/button";
import { Mascot, MascotRig } from "@/components/Mascot";
import { SpeechBubble } from "@/components/SpeechBubble";

// In production an unknown address gets public/404.html from the host. This
// route covers the dev server and any in-app navigation to a missing page.
const NotFound = () => {
  return (
    <main className="container flex min-h-[100svh] flex-col items-center justify-center py-16 text-center">
      <div className="w-40 sm:w-52">
        <MascotRig move="idle">
          <Mascot alt="" sizes="13rem" />
        </MascotRig>
      </div>
      <SpeechBubble tail="up" className="mt-7">
        Nothing is printed on this page.
      </SpeechBubble>
      <h1 className="mt-8 font-display text-[clamp(4.5rem,24vw,9rem)] uppercase leading-none">404</h1>
      <p className="mt-4 text-lg text-parchment">The page you asked for does not exist.</p>
      <Button variant="cta" size="xl" asChild className="mt-9">
        <a href="/">Back to home</a>
      </Button>
    </main>
  );
};

export default NotFound;
