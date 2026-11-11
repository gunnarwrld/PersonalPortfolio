import { MascotBadge } from "@/components/Mascot";
import { navLinks } from "@/data/site";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { cn } from "@/lib/utils";

const SECTION_IDS = navLinks.map((link) => link.href.slice(1));

/**
 * The bar: the logo on the left, the four sections as ink buttons on the right.
 * The same buttons at every width, so there is no menu to open on a phone.
 */
const Navbar = () => {
  const { scrolled, active } = useScrollSpy(SECTION_IDS);

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-2 pt-3 sm:px-4 sm:pt-4">
      {/* Once the page has moved, content fades out as it passes under the bar instead of peeking around it. */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-mahogany via-mahogany/85 to-transparent transition-opacity duration-300",
          scrolled ? "opacity-100" : "opacity-0",
        )}
      />
      <nav
        aria-label="Main"
        className={cn(
          "relative mx-auto flex h-14 max-w-5xl items-center justify-between gap-2 rounded-sm border-[3px] border-ivory bg-espresso px-2 transition-shadow duration-200 sm:h-16 sm:px-3",
          scrolled && "shadow-[5px_5px_0_0_rgb(var(--cocoa))]",
        )}
      >
        <a href="#top" className="flex shrink-0 items-center rounded-full">
          <MascotBadge size={40} eager className="h-9 w-9 sm:h-10 sm:w-10" />
          <span className="sr-only">Gunnar Arias, back to top</span>
        </a>

        <ul className="flex items-center gap-[clamp(0.25rem,1.6vw,0.9rem)] pr-1">
          {navLinks.map((link) => {
            const current = active === link.href.slice(1);
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={current ? "location" : undefined}
                  className="btn btn-ink btn-nav"
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
