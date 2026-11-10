import { ArrowUp } from "lucide-react";
import { site, socials } from "@/data/site";

const iconLink =
  "flex h-11 w-11 items-center justify-center rounded-sm border-2 border-ivory text-ivory transition-colors hover:bg-ivory hover:text-espresso";

const Footer = () => {
  return (
    <footer className="border-t-[3px] border-ivory bg-espresso py-8">
      <div className="container flex flex-col items-center justify-between gap-5 sm:flex-row">
        <p className="typed text-center text-parchment sm:text-left">
          © {new Date().getFullYear()} {site.name}. Built in Sweden, fuelled by mate.
        </p>

        <ul className="flex items-center gap-3">
          {socials.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                aria-label={social.label}
                className={iconLink}
                {...(social.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <social.icon aria-hidden="true" className="h-5 w-5" />
              </a>
            </li>
          ))}
          <li>
            <a href="#top" aria-label="Back to top" className={iconLink}>
              <ArrowUp aria-hidden="true" className="h-5 w-5" />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
