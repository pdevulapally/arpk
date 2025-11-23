import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { ServicesList } from "@/components/services/ServicesList";
import { Clock, Users, Code, Wrench, Rocket } from "lucide-react";

export const metadata: Metadata = {
  title: "Services",
  description: "Comprehensive web development, AI integration, automation, chatbots, and payment solutions. From responsive websites to complex applications with cutting-edge technology.",
  keywords: ["web development services", "AI integration", "automation services", "chatbot development", "payment integration", "e-commerce development", "custom web apps"],
};

export default function ServicesPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-background relative w-full overflow-hidden py-20 sm:py-28">
          <div className="absolute inset-0 z-0">
            <div className="from-primary/20 via-background to-background absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]"></div>
            <div className="bg-primary/5 absolute top-0 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full blur-3xl"></div>
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:12px_12px] sm:bg-[size:16px_16px] opacity-15"></div>

          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="from-primary/10 via-foreground/85 to-foreground/50 bg-gradient-to-tl bg-clip-text text-4xl tracking-tighter text-balance text-transparent sm:text-5xl md:text-6xl lg:text-7xl mb-6">
                Our Services
              </h1>
              <p className="text-muted-foreground mx-auto mt-4 sm:mt-6 max-w-2xl text-center text-base sm:text-lg">
                Comprehensive solutions from responsive websites to AI-powered applications, automation systems, intelligent chatbots, and secure payment integrations. Every service includes detailed planning, transparent communication, and expert execution.
              </p>
            </div>
          </div>
        </section>

        {/* Detailed Services List */}
        <section className="px-4 sm:px-6 py-16 sm:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl sm:text-4xl mb-4">All Services</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Click on any service to see detailed information about what's included and our process
              </p>
            </div>

            <ServicesList />
          </div>
        </section>

        {/* Our Process Overview */}
        <section className="px-4 sm:px-6 py-16 sm:py-20 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl sm:text-4xl mb-4">Our General Process</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                While each service has its specific workflow, here's our general approach to every project
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  step: 1,
                  title: "Brief",
                  icon: Users,
                  description: "We clarify goals, constraints, and win conditions. Understanding your vision is our first priority."
                },
                {
                  step: 2,
                  title: "Design",
                  icon: Code,
                  description: "Rapid wireframes → polished UI with your feedback. Iterative design ensures we get it right."
                },
                {
                  step: 3,
                  title: "Build",
                  icon: Wrench,
                  description: "Production-ready code, shipped in weekly increments. You see progress every step of the way."
                },
                {
                  step: 4,
                  title: "Launch",
                  icon: Rocket,
                  description: "QA, performance pass, deploy, and handover. We ensure everything works perfectly before launch."
                }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.step}
                    className="bg-card border border-border rounded-2xl p-6 text-center"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-semibold mb-4">
                      {item.step}
                    </div>
                    <Icon className="h-6 w-6 text-primary mx-auto mb-3" />
                    <h3 className="font-heading text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative px-4 sm:px-6 py-16 sm:py-20">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
          </div>
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="font-heading tracking-tight text-3xl sm:text-4xl md:text-5xl mb-6">
              Ready to get started?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Let's discuss how we can help bring your project to life with our comprehensive services.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/request"
                className="inline-flex items-center justify-center rounded-full px-8 py-4 text-lg font-medium text-primary-foreground shadow-lg transition-all bg-primary hover:shadow-primary/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Request a Quote
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full px-8 py-4 text-lg font-medium border border-border bg-background/60 hover:bg-accent/30 backdrop-blur focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
