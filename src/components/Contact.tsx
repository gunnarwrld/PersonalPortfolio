import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileDown, Send } from "lucide-react";
import { contactSchema, type ContactFormValues } from "@/lib/contactSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Confetti, Mascot, MascotRig, type MascotMove } from "@/components/Mascot";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { useToast } from "@/hooks/use-toast";
import { cv, site, socials } from "@/data/site";

const Contact = () => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  // The star on the poster answers the form: a jump when a message goes out, a flinch when it fails.
  const [move, setMove] = useState<MascotMove>("idle");
  const [bursts, setBursts] = useState(0);
  const backToIdle = useCallback(() => setMove("idle"), []);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "", website: "" },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error ?? `Request failed (${res.status})`);
      }

      toast({
        title: "Message sent",
        description: `Thanks ${data.name}, I'll get back to you soon.`,
      });
      form.reset();
      setMove("celebrate");
      setBursts((count) => count + 1);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      toast({
        title: "Couldn't send message",
        description: `${message} You can also email ${site.email}.`,
        variant: "destructive",
      });
      setMove("oops");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-title" className="py-20 sm:py-28">
      <div className="container">
        {/* Heading and links on the left, the poster beside them, so the form is in view at once. */}
        <div className="grid items-start gap-x-14 gap-y-4 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <SectionHeading id="contact" title="Contact" say="Hiring, or have a project? Write to me." />
            <Reveal>
            <p className="max-w-[52ch] text-lg leading-relaxed text-parchment">
              I&apos;m always open to discussing new projects, collaboration opportunities, or just having a chat
              about tech. Drop me a message!
            </p>

            <ul className="mt-8 flex flex-wrap gap-5">
              {cv && (
                <li>
                  <Button variant="ink" asChild>
                    <a href={cv.href} download={cv.fileName}>
                      <FileDown aria-hidden="true" />
                      Download CV
                      <span className="sr-only">(PDF)</span>
                    </a>
                  </Button>
                </li>
              )}
              {socials.map((social) => (
                <li key={social.label}>
                  <Button variant="ink" asChild>
                    <a
                      href={social.href}
                      {...(social.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      <social.icon aria-hidden="true" />
                      {social.label}
                    </a>
                  </Button>
                </li>
              ))}
            </ul>
            </Reveal>
          </div>

          {/* The poster. The star stands on its top edge. */}
          <div className="relative mt-24 sm:mt-28 lg:mt-24">
            <div className="absolute bottom-full right-5 z-10 w-24 translate-y-[0.5rem] sm:right-8 sm:w-32">
              <MascotRig move={move} onDone={backToIdle} className="relative">
                <Mascot alt="" sizes="8rem" />
                {move === "celebrate" && <Confetti key={bursts} />}
              </MascotRig>
            </div>

            <Reveal className="paper p-6 sm:p-9" delay={120}>
              <h3 className="border-b-[3px] border-double border-espresso pb-4 text-center font-display text-3xl uppercase leading-none sm:text-4xl">
                Write to me
              </h3>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-5" noValidate>
                  {/* Honeypot: invisible to humans, irresistible to bots. */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      left: "-10000px",
                      width: 1,
                      height: 1,
                      overflow: "hidden",
                    }}
                  >
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input tabIndex={-1} autoComplete="off" placeholder="Leave this empty" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" autoComplete="name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="your@email.com" type="email" autoComplete="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Tell me about your project..." rows={5} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" variant="cta" size="xl" disabled={submitting} className="w-full">
                    <Send aria-hidden="true" />
                    {submitting ? "Sending…" : "Send message"}
                  </Button>
                  <p className="typed text-center">
                    Or email{" "}
                    <a
                      href={`mailto:${site.email}`}
                      className="font-bold underline decoration-2 underline-offset-4 hover:decoration-4"
                    >
                      {site.email}
                    </a>
                  </p>
                </form>
              </Form>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
