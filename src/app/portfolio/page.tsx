"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";

const projects = [
  {
    title: "Senj Jewels",
    description: "A modern e‑commerce store for jewelry, featuring secure payments and real‑time inventory.",
    clientType: "Business",
    budget: "£1000",
    timeline: "8 weeks",
    completed: "15/11/2024",
    technologies: ["React", "Node.js", "Stripe", "Firebase", "Tailwind CSS"],
    features: ["Real‑time Analytics", "Product integration", "Custom Dashboards", "API Integration"],
    cover: "/Images/senjewels.png",
    liveUrl: "https://senjewels.com/",
  },
  {
    title: "Alison Tait Coaching",
    description: "High‑end coaching platform with personalized user dashboards and progress tracking",
    clientType: "Business",
    budget: "£500",
    timeline: "2 weeks",
    completed: "22/10/2024",
    technologies: ["Next.js", "PostgreSQL", "Firebase", "PWA"],
    features: ["Custom dashboard", "Payment Processing", "Inventory Management"],
    cover: "/Images/alison-tait-coaching.png",
    liveUrl: "https://www.alisontaitcoaching.co.uk/",
  },
  {
    title: "Westminster Hindu Society",
    description: "A vibrant society website for the University of Westminster, featuring event management and member portal",
    clientType: "University",
    budget: "Free",
    timeline: "2 weeks",
    completed: "30/09/2024",
    technologies: ["React", "Firebase", "Tailwind CSS", "Node.js"],
    features: ["Appointment Booking", "Patient Portal", "HIPAA Compliant", "Telehealth"],
    cover: "/Images/westminster-hindu-society.png",
    liveUrl: "https://www.westminsterhindusociety.co.uk/",
  },
  {
    title: "University of Westminster Desi Society",
    description: "A dynamic society website for the University of Westminster, featuring event management and member portal",
    clientType: "Creative",
    budget: "£100",
    timeline: "2 weeks",
    completed: "14/08/2024",
    technologies: ["Next.js", "Firebase", "Tailwind CSS", "Node.js"],
    features: ["Interactive Gallery", "Event Calendar", "Member Portal", "Newsletter Signup"],
    cover: "/Images/uow-desi-society.png",
    liveUrl: "https://uowdesisoc.co.uk/",
  },
];

export default function PortfolioPage() {
  return (
    <>
      <Header />
      <main className="relative px-4 sm:px-6 py-16 sm:py-20">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-[900px] w-[900px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>
      <div className="max-w-7xl mx-auto">
        {/* Premium hero */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="font-heading text-4xl sm:text-5xl tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">Portfolio</h1>
          <p className="text-muted-foreground mt-3">A selection of recent work. Built for clarity, performance, and real outcomes.</p>
        </div>

        {/* Grid */}
        <motion.div
          className="mt-10 grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
        >
          {projects.map((p) => (
            <motion.div
              key={p.title}
              variants={{ hidden: { y: 12, opacity: 0 }, show: { y: 0, opacity: 1 } }}
              className="group relative rounded-3xl p-[1px] bg-gradient-to-br from-primary/30 via-border to-transparent"
            >
              <div className="rounded-3xl border border-border/60 bg-card/80 overflow-hidden shadow-sm transition-all duration-300 group-hover:shadow-md">
                <div className="relative aspect-video w-full overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.cover} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
                    {((p as any).tags ?? (p as any).technologies ?? []).map((t: string) => (
                      <span key={t} className="text-[10px] sm:text-xs rounded-full border border-border/70 bg-background/70 backdrop-blur px-2 py-0.5">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-lg">{p.title}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{p.description}</p>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                    <div><span className="text-foreground">Client:</span> {p.clientType}</div>
                    <div><span className="text-foreground">Budget:</span> {p.budget}</div>
                    <div><span className="text-foreground">Timeline:</span> {p.timeline}</div>
                    <div><span className="text-foreground">Completed:</span> {p.completed}</div>
                  </div>
                  <div className="mt-4">
                    <div className="text-xs text-foreground">Technologies</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {p.technologies.map((t: string) => (
                        <span key={t} className="text-[10px] sm:text-xs rounded-full border border-border px-2 py-0.5">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-xs text-foreground">Key Features</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {p.features.map((f: string) => (
                        <span key={f} className="text-[10px] sm:text-xs rounded-full border border-border px-2 py-0.5">{f}</span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-5 flex gap-3">
                    <Link href={p.liveUrl || "/request"} className="inline-flex items-center rounded-full border border-border px-4 py-2 text-sm hover:bg-accent/30">
                      {p.liveUrl ? "View Live" : "View Project"}
                    </Link>
                    <Link href="/request" className="inline-flex items-center rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm hover:opacity-90">
                      Request similar
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
    <Footer />
    </>
  );
}


