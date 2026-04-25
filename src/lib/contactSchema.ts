import { z } from "zod";

/**
 * Validation schema for the contact form on gunnarwrld.com.
 *
 * Used by:
 *   - src/components/Contact.tsx  (client-side validation via react-hook-form)
 *   - src/components/Contact.test.tsx, src/lib/contactSchema.test.ts (unit tests)
 *
 * NOTE: api/contact.ts intentionally keeps its own copy of this schema
 * because the api/ directory is compiled as a separate Vercel function
 * with its own tsconfig and cannot import from src/. If you change rules
 * here, mirror them in api/contact.ts.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  message: z.string().trim().min(1, "Message is required").max(2000),
  // Honeypot — must stay empty. Bots fill every field; humans never see it.
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
