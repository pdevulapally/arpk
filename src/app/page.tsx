"use client";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Rocket, Brush, Wrench, ClipboardList } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";

// Lazy load heavy components
const FeaturesSectionWithCardGradient = dynamic(() => import("@/components/ui/feature-section-with-card-gradient").then(mod => ({ default: mod.FeaturesSectionWithCardGradient })), {
  loading: () => <div className="h-64 animate-pulse bg-muted rounded-lg" />,
});
const Feature = dynamic(() => import("@/components/ui/feature-section-with-grid").then(mod => ({ default: mod.Feature })), {
  loading: () => <div className="h-64 animate-pulse bg-muted rounded-lg" />,
});
const LogoMarquee = dynamic(() => import("@/components/ui/logo-marquee").then(mod => ({ default: mod.LogoMarquee })), {
  loading: () => <div className="h-20 animate-pulse bg-muted rounded" />,
});

export default function Home() {
  return (
    <>
      <Header />
    <div className="min-h-screen">
      {/* Hero Section - Gradient with Motion */}
      <section className="bg-background relative w-full overflow-hidden min-h-[70vh] sm:min-h-[75vh] lg:min-h-[80vh]">
        {/* Background gradient + grid */}
        <div className="absolute inset-0 z-0">
          <div className="from-primary/20 via-background to-background absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]"></div>
          <div className="bg-primary/5 absolute top-0 left-1/2 -z-10 h-[900px] w-[900px] -translate-x-1/2 rounded-full blur-3xl"></div>
            </div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:12px_12px] sm:bg-[size:16px_16px] opacity-15"></div>

        <div className="relative z-10 container mx-auto px-4 py-20 sm:px-6 lg:px-8 sm:py-28 lg:py-40">
          <div className="mx-auto max-w-6xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto mb-6 flex justify-center"
            >
              <div className="border-border bg-background/80 inline-flex items-center rounded-full border px-3 py-1 text-sm backdrop-blur-sm">
                <span className="bg-primary mr-2 rounded-full px-2 py-0.5 text-xs font-semibold text-white">
                  New
                </span>
                <span className="text-muted-foreground">
                  Available for new web & app projects
                </span>
                <ChevronRight className="text-muted-foreground ml-1 h-4 w-4" />
              </div>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="from-primary/10 via-foreground/85 to-foreground/50 bg-gradient-to-tl bg-clip-text text-center text-3xl tracking-tighter text-balance text-transparent sm:text-5xl md:text-6xl lg:text-7xl"
            >
              Web & software, built clearly and delivered expertly
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-muted-foreground mx-auto mt-4 sm:mt-6 max-w-2xl text-center text-base sm:text-lg"
            >
              ARPK crafts premium websites, software, AI integrations, automation systems, chatbots, and payment solutions with transparent processes, clear milestones,
              and outcomes that move your business forward.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-8 sm:mt-10 flex flex-col items-center justify-center gap-3 sm:gap-4 sm:flex-row"
            >
              <Link
                href="/request"
                className="group bg-primary text-primary-foreground hover:shadow-primary/30 relative overflow-hidden rounded-full px-6 py-3 text-base sm:text-lg shadow-lg transition-all duration-300 w-full sm:w-auto inline-flex items-center justify-center text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                aria-label="Start your project with ARPK"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Start your project
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </span>
                <span className="from-primary via-primary/90 to-primary/80 absolute inset-0 z-0 bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true"></span>
              </Link>

              <Link
                href="/contact"
                className="border-border bg-background/50 inline-flex items-center gap-2 rounded-full border px-6 py-3 text-base sm:text-lg backdrop-blur-sm hover:bg-accent/30 w-full sm:w-auto justify-center text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border"
                aria-label="Contact ARPK Studio"
              >
                Talk to us
              </Link>
            </motion.div>

            {/* Feature Image removed per request */}
          </div>
        </div>
      </section>

      {/* Logo Marquee under hero */}
      <LogoMarquee />


      {/* Services Section - Grid Feature */}
      <section className="px-4 sm:px-6 py-16 sm:py-20" aria-labelledby="services-heading">
        <div className="max-w-6xl mx-auto">
          <Feature />
        </div>
      </section>

      {/* Why Choose ARPK Section */}
      <section className="px-4 sm:px-6 py-16 sm:py-20" aria-labelledby="why-choose-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 id="why-choose-heading" className="font-heading text-3xl sm:text-4xl mb-4">Why Choose ARPK?</h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              We combine technical expertise with clear communication to deliver exceptional results.
            </p>
          </div>
          <FeaturesSectionWithCardGradient />
        </div>
      </section>

      {/* Process Section */}
      <section className="px-4 sm:px-6 py-16 sm:py-20" aria-labelledby="process-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 id="process-heading" className="font-heading text-3xl sm:text-4xl mb-4">Our Process</h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Clear milestones, transparent communication, predictable outcomes.
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.12 } },
            }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8"
          >
            {[
              { step: 1, title: "Brief", desc: "We clarify goals, constraints and the win conditions.", Icon: ClipboardList },
              { step: 2, title: "Design", desc: "Rapid wireframes → polished UI with your feedback.", Icon: Brush },
              { step: 3, title: "Build", desc: "Production‑ready code, shipped in weekly increments.", Icon: Wrench },
              { step: 4, title: "Launch", desc: "QA, performance pass, deploy and handover.", Icon: Rocket },
            ].map((item, idx) => (
              <motion.div
                key={item.step}
                variants={{ hidden: { y: 16, opacity: 0 }, show: { y: 0, opacity: 1 } }}
                className="relative"
              >
                {/* connector (desktop) */}
                <div
                  className="hidden md:block absolute top-10 right-[-20px] h-px w-10 bg-gradient-to-r from-border to-transparent"
                  style={{ visibility: idx === 3 ? "hidden" : "visible" }}
                />

                {/* gradient border card */}
                <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-primary/30 via-border to-transparent">
                  <div className="group relative h-full rounded-2xl border border-border/50 bg-card/80 p-6 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                        {item.step}
            </div>
                      <item.Icon className="h-5 w-5 text-primary/80" />
            </div>
                    <h3 className="font-heading text-lg mt-4">{item.title}</h3>
                    <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{item.desc}</p>
                    <div className="mt-5 h-1 w-20 rounded-full bg-primary/20 group-hover:bg-primary/40" />
            </div>
          </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Premium card */}
      <section className="relative px-4 sm:px-6 py-16 sm:py-20" aria-labelledby="cta-heading">
        <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl">
          <div className="relative rounded-3xl p-[1px] bg-gradient-to-br from-primary/40 via-border to-transparent">
            <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#8881_1px,transparent_1px),linear-gradient(to_bottom,#8881_1px,transparent_1px)] bg-[size:20px_20px] opacity-[0.08]" aria-hidden="true" />
              <div className="relative z-10 px-6 sm:px-10 py-10 sm:py-14 text-center">
                <h2 id="cta-heading" className="font-heading tracking-tight text-3xl sm:text-4xl md:text-5xl bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Let's build something exceptional
                </h2>
                <p className="mt-4 sm:mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                  Tell us your goals. We’ll turn them into a clear plan, a transparent timeline, and premium execution.
                </p>
                <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
                  <Link
                    href="/request"
                    className="group relative inline-flex items-center justify-center rounded-full px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium text-primary-foreground shadow-lg transition-all bg-primary hover:shadow-primary/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    aria-label="Start your project with ARPK"
                  >
                    <span className="relative z-10">Start your project</span>
                    <span className="absolute inset-0 rounded-full from-primary/80 via-primary/70 to-primary/60 bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />
            </Link>
                  <Link
                    href="/contact"
                    className="relative inline-flex items-center justify-center rounded-full px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium border border-border bg-background/60 hover:bg-accent/30 backdrop-blur focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border"
                    aria-label="Contact ARPK Studio"
                  >
                    Talk to us
            </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
      <Footer />
    </>
  );
}
