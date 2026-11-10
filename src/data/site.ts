import { Github, Linkedin, Mail, type LucideIcon } from "lucide-react";

/** One place for the facts that used to be repeated across components. */
export const site = {
  name: "Gunnar Arias",
  firstName: "Gunnar",
  url: "https://gunnarwrld.com",
  email: "ariasgunnar@gmail.com",
  github: "https://github.com/gunnarwrld",
  linkedin: "https://linkedin.com/in/gunnararias",
  location: "Kristianstad, Sweden",
} as const;

export interface SocialLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const socials: SocialLink[] = [
  { label: "GitHub", href: site.github, icon: Github },
  { label: "LinkedIn", href: site.linkedin, icon: Linkedin },
  { label: "Email", href: `mailto:${site.email}`, icon: Mail },
];

/** Section names. The nav, the headings and the page anchors all use these. */
export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
] as const;
