import { Badge } from "@/components/ui/badge";

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
                From fast marketing sites to complex web apps — built clearly and delivered expertly.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex flex-col gap-2">
              <div className="rounded-xl mb-2 overflow-hidden bg-muted ring-1 ring-border/50 shadow-sm aspect-video w-full">
                <img src="/Images/responsive.png" alt="Responsive websites preview" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl tracking-tight">Responsive Websites</h3>
              <p className="text-muted-foreground text-base">
                Beautiful, fast, SEO-friendly sites that look great on every device.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="rounded-xl mb-2 overflow-hidden bg-muted ring-1 ring-border/50 shadow-sm aspect-video w-full">
                <img src="/Images/Custom-web-apps-3d-illustration.png" alt="Custom web apps preview" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl tracking-tight">Custom Web Apps</h3>
              <p className="text-muted-foreground text-base">
                Tailored applications to match your exact workflow and needs.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="rounded-xl mb-2 overflow-hidden bg-muted ring-1 ring-border/50 shadow-sm aspect-video w-full">
                <img src="/Images/Ecommerce-10-01%20143944.png" alt="E-commerce service preview" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl tracking-tight">E‑commerce</h3>
              <p className="text-muted-foreground text-base">
                Sell online with secure payments and a smooth checkout.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="rounded-xl mb-2 overflow-hidden bg-muted ring-1 ring-border/50 shadow-sm aspect-video w-full">
                <img src="/Images/SEO-Service.png" alt="Performance and SEO service preview" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl tracking-tight">Performance & SEO</h3>
              <p className="text-muted-foreground text-base">
                Optimised speed and search visibility from day one.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="rounded-xl mb-2 overflow-hidden bg-muted ring-1 ring-border/50 shadow-sm aspect-video w-full">
                <img src="/Images/integrations.png" alt="Integrations service preview" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl tracking-tight">Integrations</h3>
              <p className="text-muted-foreground text-base">
                Connect tools like Stripe, CRMs, chat, analytics, and more.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="rounded-xl mb-2 overflow-hidden bg-muted ring-1 ring-border/50 shadow-sm aspect-video w-full">
                <img src="/Images/ChatGPT%20Image%20Oct%201%2C%202025%2C%2003_05_32%20PM.png" alt="Ongoing Support service preview" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl tracking-tight">Ongoing Support</h3>
              <p className="text-muted-foreground text-base">
                Clear communication, predictable updates, and long‑term care.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Feature };


