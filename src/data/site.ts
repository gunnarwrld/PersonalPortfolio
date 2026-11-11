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

export interface CvFile {
  /** Path under public/, so the CV is served from this domain. */
  href: string;
  /** Name the file gets when a visitor saves it. */
  fileName: string;
}

/**
 * The downloadable CV. The Contact section shows a "Download CV" button only
 * when this is set, and a unit test checks that the file is really in public/.
 *
 * This repository is public, so every version of the PDF stays in its history:
 * publish an edition without a phone number, street address or date of birth.
 */
export const cv: CvFile | null = { href: "/Gunnar-Arias-CV.pdf", fileName: "Gunnar-Arias-CV.pdf" };

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
