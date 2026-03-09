import { motion } from "framer-motion";
import { ArrowUp, Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="border-t border-border py-8"
    >
      <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-4 text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Gunnar. All rights reserved.
        </p>

        <div className="flex items-center gap-4">
          {[
            { icon: Github, href: "https://github.com/gunnarwrld", label: "GitHub" },
            { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
            { icon: Mail, href: "mailto:hello@gunnar.dev", label: "Email" },
          ].map((item) => (
            <motion.a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label={item.label}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              <item.icon className="h-4 w-4" />
            </motion.a>
          ))}

          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="ml-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Back to top"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowUp className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
