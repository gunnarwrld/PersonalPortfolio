import { useState } from "react";
import { Menu } from "lucide-react";
import { MascotBadge } from "@/components/Mascot";
import { Sheet, SheetCloseButton, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { navLinks } from "@/data/site";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { cn } from "@/lib/utils";

const SECTION_IDS = navLinks.map((link) => link.href.slice(1));

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { scrolled, active } = useScrollSpy(SECTION_IDS);

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-4 sm:pt-4">
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
          "relative mx-auto flex h-14 max-w-5xl items-center justify-between rounded-sm border-[3px] border-ivory bg-espresso pl-2 pr-2 transition-shadow duration-200 sm:h-16 sm:pl-3",
          scrolled && "shadow-[5px_5px_0_0_rgb(var(--cocoa))]",
        )}
      >
        <a href="#top" className="flex items-center rounded-full">
          <MascotBadge size={40} eager />
          <span className="sr-only">Gunnar Arias, back to top</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const current = active === link.href.slice(1);
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={current ? "location" : undefined}
                  className={cn(
                    "relative block rounded-sm px-3.5 py-2 font-semibold text-parchment transition-colors hover:bg-ivory hover:text-espresso",
                    // An ink underline marks the section on screen.
                    current && "text-ivory after:absolute after:inset-x-3.5 after:bottom-0.5 after:h-[3px] after:bg-current",
                  )}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label="Open menu"
              className="flex h-11 w-11 items-center justify-center rounded-sm border-2 border-ivory text-ivory transition-colors hover:bg-ivory hover:text-espresso md:hidden"
            >
              <Menu aria-hidden="true" className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent aria-describedby={undefined}>
            <div className="flex items-center justify-between">
              <SheetTitle>Menu</SheetTitle>
              <SheetCloseButton />
            </div>
            <ul className="mt-4 flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-sm border-2 border-ivory px-4 py-3 font-display text-2xl uppercase leading-none transition-colors hover:bg-ivory hover:text-espresso"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
};

export default Navbar;
