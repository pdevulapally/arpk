"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Briefcase, CheckCheck, Database, Server, XCircle } from "lucide-react";
import { useRef } from "react";

const plans = [
  {
    name: "Simple Website",
    description: "Perfect for portfolios and landing pages",
    priceText: "£100 – £200",
    buttonText: "Get Started",
    buttonVariant: "outline" as const,
    features: [
      { text: "1–3 pages", icon: <Briefcase size={20} /> },
      { text: "Clean, mobile‑friendly design", icon: <CheckCheck size={20} /> },
      { text: "Ideal for portfolios and landing pages", icon: <CheckCheck size={20} /> },
      { text: "Time: ~2–4 weeks", icon: <Server size={20} /> },
    ],
    includes: [
      "Includes:",
      "Basic SEO",
      "Performance baseline",
      "Clear handover",
    ],
  },
  {
    name: "Medium Website",
    description: "For businesses with more content needs",
    priceText: "£250 – £400",
    buttonText: "Get Started",
    buttonVariant: "default" as const,
    popular: true,
    features: [
      { text: "4–8 pages", icon: <Briefcase size={20} /> },
      { text: "Custom animations, contact forms", icon: <CheckCheck size={20} /> },
      { text: "Optional blog (Notion/Sanity integration)", icon: <Database size={20} /> },
      { text: "Time: ~5–7 weeks", icon: <Server size={20} /> },
    ],
    includes: [
      "Everything in Simple, plus:",
      "CMS / Blog",
      "Enhanced performance",
      "Analytics setup",
    ],
  },
  {
    name: "Complex Website",
    description: "Advanced functionality and systems",
    priceText: "£500 – £1000+",
    buttonText: "Discuss Your Build",
    buttonVariant: "outline" as const,
    features: [
      { text: "Logins, dashboards, admin panels", icon: <Briefcase size={20} /> },
      { text: "Stripe integration, user systems", icon: <Database size={20} /> },
      { text: "Custom CMS and advanced features", icon: <CheckCheck size={20} /> },
      { text: "Time: ~10–20 weeks", icon: <Server size={20} /> },
    ],
    includes: [
      "Everything in Medium, plus:",
      "Advanced integrations",
      "Auth / dashboards",
      "Tailored timelines",
    ],
  },
];

// Removed yearly toggle for simplicity – pricing is presented as starting points

export default function PricingSection() {
  const pricingRef = useRef<HTMLDivElement>(null);
  const formatNumber = (n: number) => new Intl.NumberFormat().format(n);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { delay: i * 0.2, duration: 0.45 },
    }),
    hidden: { filter: "blur(10px)", y: -20, opacity: 0 },
  };

  // Yearly toggle removed; pricing is static

  return (
    <div className="px-4 py-16 sm:py-20 min-h-screen mx-auto relative" ref={pricingRef}>
      <div className="text-center mb-8 max-w-3xl mx-auto">
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariants} custom={0}
          className="md:text-6xl sm:text-4xl text-3xl font-medium text-foreground mb-4">
          Clear, fair pricing for your project
        </motion.h2>
        <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariants} custom={1}
          className="sm:text-base text-sm text-muted-foreground w-[80%] sm:w-[70%] mx-auto">
          Pick a starting point. We’ll tailor the scope and timeline to your needs.
        </motion.p>
      </div>

      {/* Toggle removed */}

      <div className="grid md:grid-cols-3 max-w-7xl gap-4 py-6 mx-auto">
        {plans.map((plan, index) => (
          <motion.div key={plan.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariants} custom={3 + index}>
            <Card className={`relative border-border ${plan.popular ? "ring-2 ring-primary bg-primary/5" : "bg-card"}`}>
              <CardHeader className="text-left">
                <div className="flex justify-between">
                  <h3 className="text-3xl font-semibold text-foreground mb-2">{plan.name}</h3>
                  {plan.popular && (
                    <div>
                      <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">Popular</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex items-baseline">
                  <span className="text-4xl font-semibold text-foreground">{(plan as any).priceText}</span>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <a href="/request" className={`w-full mb-6 p-4 text-xl rounded-xl inline-block text-center ${
                  plan.popular
                    ? "bg-primary text-primary-foreground shadow-lg border border-primary/60"
                    : plan.buttonVariant === "outline"
                    ? "bg-foreground text-background shadow-lg"
                    : ""
                }`}>
                  {plan.buttonText}
                </a>
                <ul className="space-y-2 font-semibold py-5">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <span className="text-foreground grid place-content-center mt-0.5 mr-3">{feature.icon}</span>
                      <span className="text-sm text-muted-foreground">{feature.text}</span>
                    </li>
                  ))}
                </ul>
                <div className="space-y-3 pt-4 border-t border-border">
                  <h4 className="font-medium text-base text-foreground mb-3">{plan.includes[0]}</h4>
                  <ul className="space-y-2 font-semibold">
                    {plan.includes.slice(1).map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <span className="h-6 w-6 bg-primary/10 border border-primary/40 rounded-full grid place-content-center mt-0.5 mr-3">
                          <CheckCheck className="h-4 w-4 text-primary" />
                        </span>
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="max-w-7xl mx-auto mt-10">
        <h3 className="text-2xl font-semibold text-foreground text-center mb-4">Why choose ARPK over the rest?</h3>
        <p className="text-muted-foreground text-center mb-6">A quick look at what you get with us vs common alternatives.</p>
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-foreground">Capability</th>
                <th className="px-4 py-3 font-medium text-foreground">ARPK</th>
                <th className="px-4 py-3 font-medium text-foreground">Lovable</th>
                <th className="px-4 py-3 font-medium text-foreground">V0 / AI Boilerplates</th>
                <th className="px-4 py-3 font-medium text-foreground">No‑code CMS (WordPress)</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  label: "Direct access to developers",
                  arpk: true,
                  lovable: false,
                  v0: false,
                  wp: false,
                },
                {
                  label: "Custom design and build",
                  arpk: true,
                  lovable: false,
                  v0: "limited",
                  wp: "theme‑based",
                },
                {
                  label: "Transparent milestones & timelines",
                  arpk: true,
                  lovable: "varies",
                  v0: false,
                  wp: "varies",
                },
                {
                  label: "Performance + SEO baseline",
                  arpk: true,
                  lovable: "basic",
                  v0: "basic",
                  wp: "plugin‑dependent",
                },
                {
                  label: "Complex integrations (Stripe, auth, dashboards)",
                  arpk: true,
                  lovable: false,
                  v0: "starter",
                  wp: "plugins",
                },
                {
                  label: "Ongoing support after launch",
                  arpk: true,
                  lovable: false,
                  v0: false,
                  wp: "agency‑dependent",
                },
              ].map((row) => (
                <tr key={row.label} className="border-t border-border/60">
                  <td className="px-4 py-3 text-foreground">{row.label}</td>
                  {[row.arpk, row.lovable, row.v0, row.wp].map((val, idx) => (
                    <td key={idx} className="px-4 py-3 text-center">
                      {val === true ? (
                        <CheckCheck className="inline h-5 w-5 text-primary" />
                      ) : val === false ? (
                        <XCircle className="inline h-5 w-5 text-muted-foreground" />
                      ) : (
                        <span className="text-muted-foreground">{String(val)}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* How It Works (Premium) */}
      <div className="max-w-7xl mx-auto mt-12">
        <h3 className="text-2xl sm:text-3xl font-semibold text-foreground text-center">How It Works</h3>
        <p className="text-muted-foreground text-center mt-2">Our transparent pricing process explained</p>

        <div className="relative mt-6 rounded-3xl p-[1px] bg-gradient-to-br from-primary/40 via-border to-transparent">
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8881_1px,transparent_1px),linear-gradient(to_bottom,#8881_1px,transparent_1px)] bg-[size:18px_18px] opacity-[0.06]" />
            <div className="relative z-10 p-6 sm:p-10">
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="rounded-2xl border border-border/60 bg-background/50 p-5">
                  <div className="text-sm text-muted-foreground mb-2">Typical ranges</div>
                  <div className="space-y-2 text-sm text-foreground">
                    <div><span className="font-medium">Simple portfolio:</span> £100–200</div>
                    <div><span className="font-medium">Business site:</span> £250–400</div>
                    <div><span className="font-medium">E‑com/Dashboards:</span> £500+</div>
                  </div>
                </div>
                <div className="rounded-2xl border border-border/60 bg-background/50 p-5">
                  <div className="text-sm text-muted-foreground mb-2">What drives price</div>
                  <ul className="space-y-2 text-sm text-foreground">
                    <li>Pages and content volume</li>
                    <li>Integrations (Stripe, auth, APIs)</li>
                    <li>Animations and custom UI</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-border/60 bg-background/50 p-5">
                  <div className="text-sm text-muted-foreground mb-2">What you receive</div>
                  <ul className="space-y-2 text-sm text-foreground">
                    <li>Clear, itemised quote</li>
                    <li>Timeline with milestones</li>
                    <li>No hidden fees or surprises</li>
                  </ul>
                </div>
              </div>

              <p className="text-muted-foreground mt-6 text-center">Send a request and we’ll reply with a tailored quote and delivery plan.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


