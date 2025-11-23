import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

 function Feature() {
  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex flex-col gap-10">
          <div className="flex gap-4 flex-col items-start">
            <div>
              <Badge>Services</Badge>
            </div>
            <div className="flex gap-2 flex-col">
              <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-left">
                What we do at ARPK
              </h2>
              <p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-muted-foreground  text-left">
                From fast marketing sites to complex web apps with AI, automation, and payment solutions — built clearly and delivered expertly.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex flex-col gap-2 group">
              <div className="rounded-xl mb-2 overflow-hidden bg-muted ring-1 ring-border/50 shadow-sm aspect-video w-full relative">
                <Image src="/Images/responsive.png" alt="Responsive websites preview" fill className="object-cover" />
              </div>
              <h3 className="text-xl tracking-tight">Responsive Websites</h3>
              <p className="text-muted-foreground text-base">
                Beautiful, fast, SEO-friendly sites that look great on every device.
              </p>
              <Link 
                href="/services#responsive-websites" 
                className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all text-sm font-medium mt-2 group-hover:text-primary/80"
              >
                Learn more <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="flex flex-col gap-2 group">
              <div className="rounded-xl mb-2 overflow-hidden bg-muted ring-1 ring-border/50 shadow-sm aspect-video w-full relative">
                <Image src="/Images/Custom-web-apps-3d-illustration.png" alt="Custom web apps preview" fill className="object-cover" />
              </div>
              <h3 className="text-xl tracking-tight">Custom Web Apps</h3>
              <p className="text-muted-foreground text-base">
                Tailored applications to match your exact workflow and needs.
              </p>
              <Link 
                href="/services#custom-web-apps" 
                className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all text-sm font-medium mt-2 group-hover:text-primary/80"
              >
                Learn more <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="flex flex-col gap-2 group">
              <div className="rounded-xl mb-2 overflow-hidden bg-muted ring-1 ring-border/50 shadow-sm aspect-video w-full relative">
                <Image src="/Images/Ecommerce-10-01%20143944.png" alt="E-commerce service preview" fill className="object-cover" />
              </div>
              <h3 className="text-xl tracking-tight">E‑commerce</h3>
              <p className="text-muted-foreground text-base">
                Sell online with secure payments and a smooth checkout.
              </p>
              <Link 
                href="/services#ecommerce" 
                className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all text-sm font-medium mt-2 group-hover:text-primary/80"
              >
                Learn more <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="flex flex-col gap-2 group">
              <div className="rounded-xl mb-2 overflow-hidden bg-muted ring-1 ring-border/50 shadow-sm aspect-video w-full relative">
                <Image src="/Images/SEO-Service.png" alt="Performance and SEO service preview" fill className="object-cover" />
              </div>
              <h3 className="text-xl tracking-tight">Performance & SEO</h3>
              <p className="text-muted-foreground text-base">
                Optimised speed and search visibility from day one.
              </p>
              <Link 
                href="/services#performance-seo" 
                className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all text-sm font-medium mt-2 group-hover:text-primary/80"
              >
                Learn more <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="flex flex-col gap-2 group">
              <div className="rounded-xl mb-2 overflow-hidden bg-muted ring-1 ring-border/50 shadow-sm aspect-video w-full relative">
                <Image src="/Images/integrations.png" alt="Integrations service preview" fill className="object-cover" />
              </div>
              <h3 className="text-xl tracking-tight">Integrations</h3>
              <p className="text-muted-foreground text-base">
                Connect tools like Stripe, CRMs, chat, analytics, and more.
              </p>
              <Link 
                href="/services#integrations" 
                className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all text-sm font-medium mt-2 group-hover:text-primary/80"
              >
                Learn more <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="flex flex-col gap-2 group">
              <div className="rounded-xl mb-2 overflow-hidden bg-muted ring-1 ring-border/50 shadow-sm aspect-video w-full relative">
                <Image src="/Images/ChatGPT%20Image%20Oct%201%2C%202025%2C%2003_05_32%20PM.png" alt="AI Integration service preview" fill className="object-cover" />
              </div>
              <h3 className="text-xl tracking-tight">AI Integration</h3>
              <p className="text-muted-foreground text-base">
                Leverage AI and machine learning to automate tasks, enhance user experience, and drive intelligent insights.
              </p>
              <Link 
                href="/services#ai-integration" 
                className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all text-sm font-medium mt-2 group-hover:text-primary/80"
              >
                Learn more <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="flex flex-col gap-2 group">
              <div className="rounded-xl mb-2 overflow-hidden bg-muted ring-1 ring-border/50 shadow-sm aspect-video w-full relative">
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <svg className="w-16 h-16 text-primary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl tracking-tight">Automation</h3>
              <p className="text-muted-foreground text-base">
                Streamline workflows with automated processes that save time and reduce manual errors.
              </p>
              <Link 
                href="/services#automation" 
                className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all text-sm font-medium mt-2 group-hover:text-primary/80"
              >
                Learn more <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="flex flex-col gap-2 group">
              <div className="rounded-xl mb-2 overflow-hidden bg-muted ring-1 ring-border/50 shadow-sm aspect-video w-full relative">
                <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center">
                  <svg className="w-16 h-16 text-blue-500/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl tracking-tight">Chatbots</h3>
              <p className="text-muted-foreground text-base">
                Intelligent chatbots that provide 24/7 customer support, answer queries, and guide users seamlessly.
              </p>
              <Link 
                href="/services#chatbots" 
                className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all text-sm font-medium mt-2 group-hover:text-primary/80"
              >
                Learn more <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="flex flex-col gap-2 group">
              <div className="rounded-xl mb-2 overflow-hidden bg-muted ring-1 ring-border/50 shadow-sm aspect-video w-full relative">
                <Image src="/Images/Stripe_Logo,_revised_2016.svg.png" alt="Payment integration service preview" fill className="object-contain p-4" />
              </div>
              <h3 className="text-xl tracking-tight">Payment Integration</h3>
              <p className="text-muted-foreground text-base">
                Secure payment processing with Stripe, PayPal, and other gateways. Handle subscriptions, one-time payments, and more.
              </p>
              <Link 
                href="/services#payment-integration" 
                className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all text-sm font-medium mt-2 group-hover:text-primary/80"
              >
                Learn more <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="flex flex-col gap-2 group">
              <div className="rounded-xl mb-2 overflow-hidden bg-muted ring-1 ring-border/50 shadow-sm aspect-video w-full relative">
                <Image src="/Images/Maintainance.png" alt="Ongoing Support service preview" fill className="object-cover" />
              </div>
              <h3 className="text-xl tracking-tight">Ongoing Support</h3>
              <p className="text-muted-foreground text-base">
                Clear communication, predictable updates, and long‑term care.
              </p>
              <Link 
                href="/services#ongoing-support" 
                className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all text-sm font-medium mt-2 group-hover:text-primary/80"
              >
                Learn more <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Feature };


