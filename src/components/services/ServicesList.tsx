"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronDown, CheckCircle2, Clock, Code, Zap, MessageSquare, CreditCard, Globe, Settings, Wrench, Rocket, HelpCircle } from "lucide-react";

export function ServicesList() {
  const [expandedService, setExpandedService] = useState<string | null>(null);

  // Auto-expand service if hash is in URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setExpandedService(hash);
        // Smooth scroll to element
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    }
  }, []);

  const toggleService = (serviceId: string) => {
    const newExpanded = expandedService === serviceId ? null : serviceId;
    setExpandedService(newExpanded);
    // Update URL hash safely
    if (typeof window !== 'undefined') {
      try {
        if (newExpanded === null) {
          // Remove hash
          const url = new URL(window.location.href);
          url.hash = '';
          window.history.replaceState(null, '', url.toString());
        } else {
          // Add hash
          const url = new URL(window.location.href);
          url.hash = serviceId;
          window.history.replaceState(null, '', url.toString());
        }
      } catch (error) {
        // Fallback: just update hash directly if URL constructor fails
        if (newExpanded === null) {
          window.location.hash = '';
        } else {
          window.location.hash = serviceId;
        }
      }
    }
  };

  const services = [
    {
      id: "responsive-websites",
      title: "Responsive Websites",
      icon: Globe,
      description: "Beautiful, fast websites that look perfect on phones, tablets, and computers.",
      image: "/Images/responsive.png",
      overview: "Your website is often the first impression customers have of your business. We create stunning websites that automatically adjust to look perfect on any device - whether someone visits on their phone, tablet, or desktop computer. No matter how they access your site, it will load quickly, look professional, and be easy to navigate.",
      whatItMeans: "A responsive website means your site automatically changes its layout and design to fit the screen it's being viewed on. Think of it like a smart window that adjusts its size - on a phone it shows a mobile-friendly version, on a tablet it shows a medium-sized layout, and on a computer it shows the full desktop experience. This ensures every visitor has a great experience, no matter what device they use.",
      useCases: [
        "You need a professional website for your business",
        "Your current website looks broken on mobile devices",
        "You want to showcase your products or services online",
        "You need a simple way for customers to contact you",
        "You want to establish an online presence"
      ],
      benefits: [
        "More customers can find and use your website (over 60% of web traffic is mobile)",
        "Better search engine rankings (Google favors mobile-friendly sites)",
        "Professional appearance builds trust with potential customers",
        "Faster loading times mean visitors don't leave before seeing your content",
        "Easy to update and manage your content yourself"
      ],
      includes: [
        "Website that works perfectly on phones, tablets, and computers",
        "Fast loading times so visitors don't wait",
        "Search engine optimization so Google can find your site",
        "Contact forms so customers can easily reach you",
        "Works with all web browsers (Chrome, Safari, Firefox, etc.)",
        "Accessible to people with disabilities (screen readers, keyboard navigation)",
        "Secure connection (SSL certificate) so data is protected",
        "Help setting up your domain name and hosting",
        "Google Analytics to see how many people visit your site",
        "Easy-to-use content management so you can update text and images yourself"
      ],
      process: [
        {
          step: "Discovery Call",
          description: "We have a friendly conversation about your business, what you want your website to do, who your customers are, and what makes your business special. This helps us understand exactly what you need."
        },
        {
          step: "Design & Approval",
          description: "We create visual mockups (like blueprints) showing how your website will look. You review these and tell us what you like or want to change. We keep refining until it's perfect."
        },
        {
          step: "Building Your Site",
          description: "Once you approve the design, we build your actual website. We use modern, reliable technology that ensures your site is fast, secure, and will work for years to come."
        },
        {
          step: "Testing Everything",
          description: "We test your website on different devices and browsers to make sure everything works perfectly. We check all links, forms, and features to ensure nothing is broken."
        },
        {
          step: "Launch & Training",
          description: "We put your website live on the internet, do final checks, and then show you how to update content yourself. You'll receive documentation and we're always available if you need help."
        }
      ],
      timeline: "2-4 weeks",
      technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel"],
      faq: [
        {
          q: "How much does a website cost?",
          a: "Website costs vary based on size and features. A simple business website typically starts around £500-£1,500. We provide transparent quotes with no hidden fees - 50% deposit, 50% on completion."
        },
        {
          q: "Can I update the website myself?",
          a: "Yes! We build websites with easy-to-use content management systems. You can update text, images, and add new pages without needing technical knowledge. We'll train you on how to do this."
        },
        {
          q: "Will my website work on mobile phones?",
          a: "Absolutely! All our websites are fully responsive, meaning they automatically adjust to look perfect on phones, tablets, and computers. This is included in every website we build."
        },
        {
          q: "How long does it take to build a website?",
          a: "A typical business website takes 2-4 weeks from start to finish. This includes design, development, testing, and your feedback. More complex sites may take longer, which we'll discuss upfront."
        }
      ]
    },
    {
      id: "custom-web-apps",
      title: "Custom Web Apps",
      icon: Code,
      description: "Software applications built specifically for your business needs.",
      image: "/Images/Custom-web-apps-3d-illustration.png",
      overview: "Sometimes a regular website isn't enough - you need a custom software application that does exactly what your business needs. Whether it's managing customer data, processing orders, tracking inventory, or automating workflows, we build applications tailored to your specific business processes. Think of it as having software built just for you, rather than trying to make generic software fit your needs.",
      whatItMeans: "A custom web app is like having software built specifically for your business. Instead of using generic tools that don't quite fit, we create an application that matches your exact workflow. For example, if you need to track customer orders, manage inventory, handle bookings, or process data in a specific way, we build it exactly how you need it. It's accessible through a web browser, so you and your team can use it from anywhere.",
      useCases: [
        "You need to manage customer data and relationships",
        "You want to automate repetitive business tasks",
        "You need a booking or appointment system",
        "You want to track inventory or orders in a specific way",
        "You need internal tools for your team to use",
        "You want to process and analyze business data"
      ],
      benefits: [
        "Saves time by automating manual work",
        "Reduces errors by eliminating repetitive tasks",
        "Improves efficiency with workflows designed for your business",
        "Centralizes data so everything is in one place",
        "Scales with your business as you grow",
        "Accessible from anywhere with internet connection"
      ],
      includes: [
        "Application designed specifically for your business needs",
        "User login system so only authorized people can access it",
        "Database to store all your information securely",
        "Dashboard to see important information at a glance",
        "Different access levels (admin, staff, customer, etc.)",
        "Ability to export data to Excel or PDF",
        "Connections to other tools you use (email, calendars, etc.)",
        "Real-time updates so information is always current",
        "Mobile-friendly so you can use it on your phone",
        "Complete documentation and training for your team"
      ],
      process: [
        {
          step: "Understanding Your Needs",
          description: "We sit down with you to understand exactly what your business does, what problems you're trying to solve, and how you currently work. We ask lots of questions to make sure we build exactly what you need."
        },
        {
          step: "Planning the Solution",
          description: "We design how the application will work - what screens you'll see, what buttons you'll click, and how information will flow. We create a plan and show it to you before we start building."
        },
        {
          step: "Building in Stages",
          description: "We build your application in weekly stages, showing you progress each week. You can test it and give feedback as we go, so we can adjust things before they're finished. This ensures you get exactly what you want."
        },
        {
          step: "Thorough Testing",
          description: "We test everything thoroughly - trying different scenarios, checking for bugs, and making sure all features work correctly. We also have you test it to ensure it works the way you expect."
        },
        {
          step: "Launch & Training",
          description: "We put your application live, train your team on how to use it, and provide documentation. We're available for questions and can make adjustments if needed after launch."
        }
      ],
      timeline: "4-12 weeks (depends on complexity)",
      technologies: ["Next.js", "Node.js", "PostgreSQL", "Firebase", "TypeScript"],
      faq: [
        {
          q: "How is this different from a regular website?",
          a: "A website shows information. A web app lets you DO things - manage data, process orders, automate tasks, track inventory, etc. It's interactive software, not just pages of content."
        },
        {
          q: "How much does a custom app cost?",
          a: "Costs vary based on complexity. Simple apps start around £2,000-£5,000. More complex applications can be £10,000+. We provide detailed quotes after understanding your needs, with transparent pricing and payment plans."
        },
        {
          q: "Can you integrate with tools I already use?",
          a: "Yes! We can connect your app to email systems, calendars, payment processors, CRMs, and many other tools. We'll discuss what you use and how to connect them during planning."
        },
        {
          q: "What if I need changes after it's built?",
          a: "We offer ongoing support and can make updates, add features, or fix issues. We can work on an hourly basis or set up a maintenance plan depending on your needs."
        }
      ]
    },
    {
      id: "ecommerce",
      title: "E-commerce Store",
      icon: CreditCard,
      description: "Complete online store to sell products with secure payments.",
      image: "/Images/Ecommerce-10-01%20143944.png",
      overview: "Sell your products online with a complete e-commerce store. Customers can browse your products, add items to their cart, and checkout securely. You can manage inventory, process orders, handle shipping, and track sales - all from an easy-to-use admin dashboard. We handle all the technical complexity so you can focus on selling.",
      whatItMeans: "An e-commerce store is like having a physical shop, but online. Customers visit your website, browse products with photos and descriptions, add items to a shopping cart, and pay securely. You get an admin area where you can add products, see orders, manage inventory, print shipping labels, and track sales. Everything is automated - when someone orders, you get notified, and you can process and ship their order.",
      useCases: [
        "You want to sell physical products online",
        "You need to sell digital products or downloads",
        "You want to offer subscriptions or recurring payments",
        "You need to manage inventory and track stock levels",
        "You want to sell to customers worldwide",
        "You need to handle multiple payment methods"
      ],
      benefits: [
        "Sell 24/7 without needing a physical store",
        "Reach customers anywhere in the world",
        "Automated order processing saves time",
        "Track inventory automatically",
        "Accept multiple payment methods (cards, PayPal, etc.)",
        "Professional appearance builds customer trust",
        "Easy to add new products and update prices",
        "Built-in analytics to see what's selling"
      ],
      includes: [
        "Product catalog where you can add unlimited products with photos",
        "Shopping cart where customers can add multiple items",
        "Secure checkout process with multiple payment options",
        "Order management system to see and process all orders",
        "Inventory tracking that updates automatically when items sell",
        "Customer accounts so buyers can track their orders",
        "Shipping calculator that shows costs based on location",
        "Email notifications sent automatically (order confirmations, shipping updates)",
        "Admin dashboard to manage everything easily",
        "Product search and filtering so customers can find items quickly",
        "Product reviews and ratings from customers",
        "Wishlist feature so customers can save items for later",
        "Discount codes and promotional pricing",
        "Sales reports and analytics"
      ],
      process: [
        {
          step: "Store Planning",
          description: "We discuss what products you're selling, how you want to organize them (categories), what payment methods you want to accept, shipping options, and any special features you need. We plan everything out before building."
        },
        {
          step: "Design & Shopping Experience",
          description: "We design how your store will look and how customers will shop. We create product pages, shopping cart, and checkout flow that's easy and encourages purchases. You review and approve the design."
        },
        {
          step: "Building Your Store",
          description: "We build all the features - product pages, cart, checkout, payment processing, admin dashboard, and inventory management. Everything is connected and working together."
        },
        {
          step: "Setting Up Payments",
          description: "We connect secure payment processors (like Stripe or PayPal) so customers can pay safely. We test payments thoroughly to ensure transactions work correctly."
        },
        {
          step: "Adding Your Products",
          description: "We help you add your products - uploading photos, writing descriptions, setting prices, and organizing into categories. We can import from spreadsheets if you have many products."
        },
        {
          step: "Testing & Launch",
          description: "We test the entire shopping experience - browsing, adding to cart, checking out, and processing payments. Once everything works perfectly, we launch your store and train you on managing orders."
        }
      ],
      timeline: "4-8 weeks",
      technologies: ["Next.js", "Stripe", "Firebase", "Node.js", "PostgreSQL"],
      faq: [
        {
          q: "How much does an online store cost?",
          a: "E-commerce stores typically cost £1,500-£5,000+ depending on features. Payment processing fees are separate (usually 2-3% per transaction). We provide detailed quotes with all costs upfront."
        },
        {
          q: "What payment methods can I accept?",
          a: "We can integrate credit/debit cards (Visa, Mastercard, Amex), PayPal, Apple Pay, Google Pay, and bank transfers. We'll discuss which options work best for your business."
        },
        {
          q: "Can I manage inventory automatically?",
          a: "Yes! The system tracks inventory - when someone buys something, stock decreases automatically. You can set low stock alerts and the system will notify you when items are running out."
        },
        {
          q: "How do I handle shipping?",
          a: "We can integrate with shipping carriers (Royal Mail, DHL, etc.) to calculate shipping costs automatically. You can also set flat rates or free shipping thresholds. We'll set this up based on your needs."
        },
        {
          q: "What if I need to add products later?",
          a: "You can easily add products yourself through the admin dashboard. Just upload photos, add descriptions and prices, and publish. No technical knowledge needed. We'll train you on this."
        }
      ]
    },
    {
      id: "performance-seo",
      title: "Performance & SEO",
      icon: Zap,
      description: "Make your website faster and easier to find on Google.",
      image: "/Images/SEO-Service.png",
      overview: "Having a website isn't enough - it needs to be fast and easy for people to find. We optimize your website's speed so pages load quickly (nobody likes waiting), and we improve your search engine optimization (SEO) so when people search on Google, your website appears higher in results. This means more visitors and more customers finding you.",
      whatItMeans: "Performance means how fast your website loads. SEO (Search Engine Optimization) means making your website easy for Google to find and rank. Think of it like this: Performance = your website loads quickly so visitors don't leave. SEO = Google shows your website when people search for what you offer. Both are crucial - a fast website that nobody can find isn't helpful, and a website that's easy to find but loads slowly will lose visitors.",
      useCases: [
        "Your website is slow and visitors leave before it loads",
        "You're not appearing in Google search results",
        "You want more people to find your website organically",
        "Your website takes too long to load on mobile devices",
        "You want to improve your Google rankings",
        "You need better visibility for your business online"
      ],
      benefits: [
        "Faster loading means visitors stay on your site longer",
        "Better Google rankings mean more free traffic",
        "Improved mobile experience (Google favors fast mobile sites)",
        "Better user experience leads to more conversions",
        "Lower bounce rate (fewer people leaving immediately)",
        "Competitive advantage over slower competitors"
      ],
      includes: [
        "Speed optimization so pages load in under 3 seconds",
        "Image optimization so photos load quickly without losing quality",
        "Mobile optimization so your site is fast on phones",
        "SEO audit to see what's working and what needs improvement",
        "Keyword research to find what your customers search for",
        "On-page optimization (titles, descriptions, headings)",
        "Technical SEO (sitemaps, structured data, etc.)",
        "Google Search Console setup to track your rankings",
        "Analytics setup to see how many visitors you get",
        "Performance monitoring to catch issues early",
        "Accessibility improvements so everyone can use your site",
        "Ongoing recommendations for continued improvement"
      ],
      process: [
        {
          step: "Current State Analysis",
          description: "We analyze your website's current speed and SEO status. We check loading times, mobile performance, Google rankings, and identify what needs improvement. We create a report showing where you are now."
        },
        {
          step: "Optimization Strategy",
          description: "We create a plan prioritizing the most impactful improvements. We identify keywords your customers search for and plan how to optimize your content. We discuss the strategy with you before making changes."
        },
        {
          step: "Implementation",
          description: "We optimize images, improve code, fix technical issues, optimize content for search engines, and make your site faster. We do this carefully to ensure nothing breaks while improving performance."
        },
        {
          step: "Testing & Verification",
          description: "We test the improvements using professional tools to verify speed increases and SEO improvements. We check that everything still works correctly and that improvements are measurable."
        },
        {
          step: "Monitoring & Reporting",
          description: "We set up monitoring tools and provide you with reports showing improvements. We give recommendations for continued optimization and can help implement ongoing improvements."
        }
      ],
      timeline: "2-4 weeks",
      technologies: ["Next.js", "Lighthouse", "Google Analytics", "Vercel Analytics"],
      faq: [
        {
          q: "How much faster will my website be?",
          a: "Most websites see 50-80% improvement in loading speed. A site that took 8 seconds might load in 2-3 seconds. Exact improvements depend on your current setup, which we'll analyze first."
        },
        {
          q: "How long until I see results in Google?",
          a: "SEO improvements can take 3-6 months to show results in Google rankings. However, speed improvements are immediate. We'll track progress and show you monthly reports of improvements."
        },
        {
          q: "Will this help me rank #1 on Google?",
          a: "SEO is competitive and ranking #1 depends on many factors including competition, content quality, and time. We focus on realistic improvements - moving from page 3 to page 1, or improving rankings for specific keywords. We'll discuss realistic expectations based on your industry."
        },
        {
          q: "Do I need to do anything after optimization?",
          a: "We'll set everything up, but SEO is ongoing. We can provide monthly reports and recommendations, or set up ongoing maintenance to continue improving. We'll discuss what makes sense for your business."
        }
      ]
    },
    {
      id: "integrations",
      title: "Integrations",
      icon: Settings,
      description: "Connect your website with the tools you already use.",
      image: "/Images/integrations.png",
      overview: "You probably use various tools for your business - email marketing, customer management, payment processing, calendars, analytics, and more. Instead of manually moving data between systems, we connect everything so information flows automatically. When a customer signs up on your website, they can be added to your email list automatically. When someone books an appointment, it can appear in your calendar. Everything works together seamlessly.",
      whatItMeans: "Integration means connecting different software tools so they can share information automatically. For example, when someone fills out a contact form on your website, that information can automatically go to your email marketing tool, your customer database, and send you a notification - all without you doing anything. It's like having all your tools talk to each other, saving you time and reducing errors from manual data entry.",
      useCases: [
        "You want contact form submissions to go to your email marketing tool",
        "You need website bookings to appear in your calendar",
        "You want customer data to sync with your CRM system",
        "You need payment information to update your accounting software",
        "You want to connect your website to social media",
        "You need inventory to sync between your website and warehouse system"
      ],
      benefits: [
        "Saves hours of manual data entry",
        "Reduces errors from copying information",
        "Everything stays in sync automatically",
        "Better customer experience with seamless connections",
        "More efficient business operations",
        "Single source of truth for your data"
      ],
      includes: [
        "Payment processor connections (Stripe, PayPal, Square)",
        "CRM integrations (Salesforce, HubSpot, Pipedrive, etc.)",
        "Email marketing tools (Mailchimp, SendGrid, Constant Contact)",
        "Analytics platforms (Google Analytics, Facebook Pixel)",
        "Customer support tools (Intercom, Zendesk, LiveChat)",
        "Calendar and booking systems",
        "Social media integrations",
        "Accounting software connections",
        "Inventory management systems",
        "Custom API connections for unique needs",
        "Webhook setup for real-time updates",
        "Data synchronization between systems"
      ],
      process: [
        {
          step: "Understanding Your Tools",
          description: "We discuss what tools and software you currently use, what information needs to flow between them, and what you want to automate. We review each tool's capabilities and plan the connections."
        },
        {
          step: "Integration Planning",
          description: "We design how information will flow between systems - what triggers what, what data goes where, and how errors will be handled. We create a plan and get your approval before building."
        },
        {
          step: "Building Connections",
          description: "We build the integrations, connecting your systems securely. We use APIs (application programming interfaces) which are secure ways for software to communicate. We test each connection thoroughly."
        },
        {
          step: "Testing & Validation",
          description: "We test the integrations with real scenarios - submitting forms, making payments, creating bookings, etc. We verify that information flows correctly and that errors are handled properly."
        },
        {
          step: "Launch & Monitoring",
          description: "We activate the integrations and monitor them to ensure they work correctly. We provide documentation on how everything works and are available if issues arise."
        }
      ],
      timeline: "1-3 weeks per integration",
      technologies: ["REST APIs", "GraphQL", "Webhooks", "OAuth", "Node.js"],
      faq: [
        {
          q: "What tools can you integrate?",
          a: "We can integrate with most popular business tools - payment processors, CRMs, email marketing platforms, calendars, analytics tools, and more. If a tool has an API (most do), we can usually connect it. We'll discuss your specific tools during planning."
        },
        {
          q: "How much does integration cost?",
          a: "Simple integrations (like connecting a contact form to email) start around £200-£500. More complex integrations (like syncing data between multiple systems) can be £500-£2,000+. We provide quotes after understanding your needs."
        },
        {
          q: "Is my data secure when integrating?",
          a: "Absolutely. We use secure, industry-standard methods (APIs, OAuth) that the tool providers recommend. We never store sensitive credentials and follow security best practices. Your data is as secure as using the tools directly."
        },
        {
          q: "What if I change tools later?",
          a: "We can update integrations if you switch tools. The cost depends on the complexity of the new integration. We'll discuss options and pricing if you need to make changes."
        },
        {
          q: "Do integrations require ongoing maintenance?",
          a: "Most integrations work reliably once set up. However, if tools update their systems, integrations may need updates. We offer maintenance plans or can fix issues as they arise on an hourly basis."
        }
      ]
    },
    {
      id: "ai-integration",
      title: "AI Integration",
      icon: Zap,
      description: "Add artificial intelligence to automate tasks and enhance user experience.",
      image: "/Images/ChatGPT%20Image%20Oct%201%2C%202025%2C%2003_05_32%20PM.png",
      overview: "Artificial Intelligence (AI) can make your website smarter and more helpful. AI can answer customer questions automatically, recommend products based on what customers like, generate content, analyze data to find insights, and automate tasks that would normally require human attention. We integrate AI capabilities into your website to save you time, improve customer experience, and provide insights you might not have noticed.",
      whatItMeans: "AI integration means adding intelligent features to your website that can think and respond like a human would, but faster and available 24/7. For example, an AI chatbot can answer customer questions instantly, even at 2 AM. AI can analyze what products customers look at and suggest similar items. AI can write product descriptions, analyze customer feedback to find trends, or automatically categorize and organize information. It's like having a smart assistant that never sleeps and can handle repetitive tasks instantly.",
      useCases: [
        "You want a chatbot that answers customer questions 24/7",
        "You need product recommendations for customers",
        "You want to analyze customer feedback automatically",
        "You need help generating content (descriptions, articles, etc.)",
        "You want intelligent search that understands what customers mean",
        "You need to automatically categorize or organize information"
      ],
      benefits: [
        "24/7 customer support without hiring more staff",
        "Personalized experiences for each customer",
        "Faster response times to customer inquiries",
        "Data insights you might not notice manually",
        "Automated content generation saves time",
        "Better customer experience with instant help"
      ],
      includes: [
        "AI chatbot for customer support and questions",
        "Intelligent product or content recommendations",
        "Smart search that understands natural language",
        "Automated content generation (descriptions, articles)",
        "Sentiment analysis of customer feedback",
        "Image recognition and automatic tagging",
        "Predictive analytics to forecast trends",
        "Automated data classification and organization",
        "Personalization based on user behavior",
        "Integration with OpenAI, Claude, or other AI services",
        "Custom AI model training for specific needs",
        "Analytics to track AI performance and usage"
      ],
      process: [
        {
          step: "Identifying AI Opportunities",
          description: "We discuss your business and identify where AI could add value. We look for repetitive tasks, customer service needs, data analysis opportunities, and areas where AI could improve customer experience. We prioritize based on impact and feasibility."
        },
        {
          step: "Choosing AI Solutions",
          description: "We select appropriate AI tools and services for your needs. This might be chatbots, recommendation engines, content generation, or custom AI models. We choose solutions that fit your budget and requirements."
        },
        {
          step: "Designing AI Features",
          description: "We design how AI will work in your website - what questions the chatbot will answer, how recommendations will work, what content will be generated, etc. We plan the user experience and how AI responses will be presented."
        },
        {
          step: "Building & Training",
          description: "We integrate AI services, train chatbots with your business information, set up recommendation algorithms, and configure content generation. We test AI responses and refine them to ensure they're helpful and accurate."
        },
        {
          step: "Testing & Refinement",
          description: "We test AI features thoroughly - trying different questions, scenarios, and use cases. We refine AI responses, improve accuracy, and ensure the AI behaves appropriately. We may need to adjust prompts or training data."
        },
        {
          step: "Launch & Monitoring",
          description: "We launch AI features and monitor their performance. We track usage, analyze AI responses, and continue refining. We set up alerts for issues and provide reports on how AI is performing."
        }
      ],
      timeline: "3-6 weeks",
      technologies: ["OpenAI API", "Anthropic Claude", "TensorFlow", "Python", "Node.js"],
      faq: [
        {
          q: "What can AI actually do for my business?",
          a: "AI can answer customer questions 24/7, recommend products, generate content, analyze data, automate repetitive tasks, and provide insights. The specific capabilities depend on your needs - we'll discuss what makes sense for your business."
        },
        {
          q: "How much does AI integration cost?",
          a: "AI integration typically costs £1,000-£5,000+ depending on complexity. There are also ongoing costs for AI API usage (usually very affordable, often pennies per interaction). We'll provide detailed cost estimates including both setup and ongoing usage."
        },
        {
          q: "Will AI replace my staff?",
          a: "No - AI augments and assists, it doesn't replace. AI handles repetitive tasks and basic inquiries, freeing your staff for more complex, valuable work. AI works alongside your team, not instead of them."
        },
        {
          q: "How accurate is AI?",
          a: "Modern AI is very accurate for most tasks. Chatbots can answer common questions correctly 90%+ of the time. We train and refine AI to improve accuracy, and we set up systems to handle cases where AI isn't sure - it can escalate to a human."
        },
        {
          q: "What if AI gives wrong information?",
          a: "We set up safeguards - AI can be trained on your specific information, we can review and approve AI responses before they go live, and we can set up human oversight. AI can also be configured to say 'I don't know' and escalate to a human when uncertain."
        }
      ]
    },
    {
      id: "automation",
      title: "Automation",
      icon: Zap,
      description: "Automate repetitive tasks to save time and reduce errors.",
      overview: "Stop doing the same tasks over and over. We create automated systems that handle repetitive work for you - sending emails when certain things happen, processing data automatically, generating reports on schedule, syncing information between systems, and more. Automation means you can focus on growing your business instead of doing manual, repetitive tasks.",
      whatItMeans: "Automation means setting up systems that do tasks automatically without you having to do them manually. For example, when someone fills out a contact form, an automated system can send them a welcome email, add them to your database, notify your team, and schedule a follow-up - all automatically. Or you can set up reports to generate and email themselves every Monday morning. Automation handles the boring, repetitive work so you don't have to.",
      useCases: [
        "You send the same emails repeatedly",
        "You manually process data or orders",
        "You copy information between different systems",
        "You generate the same reports regularly",
        "You want notifications when certain things happen",
        "You need to schedule tasks to run automatically"
      ],
      benefits: [
        "Saves hours of time every week",
        "Eliminates human errors from repetitive tasks",
        "Ensures consistency - tasks are done the same way every time",
        "Works 24/7 without breaks",
        "Frees you to focus on important work",
        "Scales easily as your business grows"
      ],
      includes: [
        "Email automation (welcome emails, follow-ups, notifications)",
        "Data processing and transformation",
        "Scheduled tasks (reports, backups, updates)",
        "Form submission automation",
        "API automation to connect different systems",
        "Database synchronization",
        "Report generation and distribution",
        "Notification systems (SMS, email, Slack, etc.)",
        "Business process automation",
        "Integration with Zapier or Make.com for easy automation",
        "Custom automation scripts for unique needs",
        "Monitoring and error handling for automated processes"
      ],
      process: [
        {
          step: "Identifying Automation Opportunities",
          description: "We discuss your daily tasks and identify what's repetitive and could be automated. We look for tasks you do regularly, data you move between systems, emails you send repeatedly, and processes that follow the same pattern every time."
        },
        {
          step: "Designing Automated Workflows",
          description: "We design how automation will work - what triggers it, what actions it takes, what happens if something goes wrong, and how you'll be notified. We create a plan and get your approval before building."
        },
        {
          step: "Building Automation",
          description: "We build the automated systems - writing scripts, setting up triggers, connecting systems, and configuring workflows. We ensure automation handles errors gracefully and notifies you if something needs attention."
        },
        {
          step: "Testing Automation",
          description: "We test automation thoroughly - trying different scenarios, edge cases, and error conditions. We verify that automation works correctly and handles unexpected situations appropriately."
        },
        {
          step: "Launch & Monitoring",
          description: "We activate automation and monitor it to ensure it runs correctly. We set up alerts for issues and provide documentation. We're available to adjust automation if your needs change."
        }
      ],
      timeline: "2-4 weeks",
      technologies: ["Node.js", "Python", "Zapier", "Make.com", "Cron Jobs"],
      faq: [
        {
          q: "What tasks can be automated?",
          a: "Almost any repetitive task can be automated - sending emails, processing data, generating reports, syncing information, sending notifications, scheduling tasks, and more. If you do something regularly and it follows a pattern, we can probably automate it."
        },
        {
          q: "How much does automation cost?",
          a: "Simple automations (like email sequences) start around £300-£800. More complex automations (like multi-system workflows) can be £1,000-£3,000+. We provide quotes after understanding what you want to automate."
        },
        {
          q: "What if automation breaks?",
          a: "We build error handling into automation - if something goes wrong, it will notify you and stop safely rather than causing problems. We can also set up monitoring to alert us if automation fails, and we offer maintenance to fix issues quickly."
        },
        {
          q: "Can I still do things manually if needed?",
          a: "Yes! Automation doesn't lock you in. You can always do tasks manually if needed, or we can build automation that allows manual overrides. Automation is there to help, not restrict you."
        },
        {
          q: "How do I know automation is working?",
          a: "We set up monitoring and notifications so you know when automation runs. We can provide reports showing what automation has done, and we'll alert you if anything needs attention."
        }
      ]
    },
    {
      id: "chatbots",
      title: "Chatbots",
      icon: MessageSquare,
      description: "Intelligent chatbots that answer questions and help customers 24/7.",
      overview: "Never miss a customer inquiry again. We build intelligent chatbots that can answer customer questions instantly, 24 hours a day, 7 days a week. Chatbots can handle common questions, help customers find products, book appointments, qualify leads, and even hand off to a human when needed. They work on your website, WhatsApp, SMS, or other messaging platforms, providing instant help whenever customers need it.",
      whatItMeans: "A chatbot is like having a customer service representative available 24/7, but it's a computer program that can answer questions instantly. When a customer visits your website and has a question, they can type it in a chat window, and the chatbot responds immediately with helpful information. The chatbot is trained on your business information, so it knows about your products, services, policies, and can answer most common questions. If it doesn't know something or the question is complex, it can transfer the conversation to a human.",
      useCases: [
        "You get the same questions repeatedly from customers",
        "You want to provide instant support outside business hours",
        "You need to qualify leads before they talk to sales",
        "You want to help customers find products or information quickly",
        "You need to handle appointment bookings automatically",
        "You want to reduce support costs while improving service"
      ],
      benefits: [
        "24/7 availability - never miss a customer inquiry",
        "Instant responses - customers get answers immediately",
        "Reduces support costs - handles common questions automatically",
        "Qualifies leads - asks questions to determine if someone is a good fit",
        "Consistent answers - gives the same accurate information every time",
        "Frees your team for complex issues",
        "Can handle multiple conversations simultaneously",
        "Works across multiple channels (website, WhatsApp, SMS)"
      ],
      includes: [
        "AI-powered chatbot that understands natural language",
        "Training on your business information and FAQs",
        "Multi-channel support (website chat, WhatsApp, SMS, Facebook Messenger)",
        "Conversation flows designed for your business",
        "Integration with your knowledge base or website content",
        "Lead capture and qualification",
        "Appointment booking through chat",
        "FAQ automation for common questions",
        "Human handoff when chatbot can't help",
        "Analytics to see what customers ask about",
        "Custom branding to match your website",
        "Multi-language support if needed"
      ],
      process: [
        {
          step: "Designing Conversations",
          description: "We map out how conversations will flow - what questions the chatbot will ask, how it will respond to different queries, and when it should transfer to a human. We design the chatbot's personality and tone to match your brand."
        },
        {
          step: "Building Knowledge Base",
          description: "We create a comprehensive knowledge base with information about your business, products, services, policies, and common questions. This is what the chatbot uses to answer questions accurately."
        },
        {
          step: "Building & Training",
          description: "We build the chatbot, integrate AI capabilities, and train it with your business information. We test it with sample conversations and refine responses to ensure it's helpful and accurate."
        },
        {
          step: "Testing Conversations",
          description: "We test the chatbot with various questions and scenarios - common questions, edge cases, complex queries, and situations where it should transfer to a human. We refine based on testing results."
        },
        {
          step: "Deployment & Monitoring",
          description: "We deploy the chatbot to your website and messaging channels. We monitor conversations to see what customers ask about, identify areas for improvement, and continue refining the chatbot's responses."
        }
      ],
      timeline: "3-5 weeks",
      technologies: ["OpenAI", "Dialogflow", "Twilio", "WhatsApp Business API", "Node.js"],
      faq: [
        {
          q: "How much does a chatbot cost?",
          a: "Chatbot development typically costs £1,500-£4,000+ depending on complexity and channels. There are also small ongoing costs for AI API usage (usually very affordable, often less than £50/month for moderate usage). We provide detailed cost estimates."
        },
        {
          q: "Can the chatbot answer all questions?",
          a: "Chatbots are excellent at answering common, straightforward questions. For complex or unusual questions, the chatbot can transfer to a human. We train chatbots to recognize when they should hand off to a person."
        },
        {
          q: "What if the chatbot gives wrong information?",
          a: "We train chatbots on your specific business information and test them thoroughly. We can also set up human review of chatbot responses, or configure the chatbot to say 'I'm not sure, let me connect you with a human' when uncertain."
        },
        {
          q: "Can I update what the chatbot knows?",
          a: "Yes! You can update the chatbot's knowledge base as your business changes. We can train you on how to do this, or we can handle updates for you. Chatbots can also learn from conversations over time."
        },
        {
          q: "Will customers know they're talking to a bot?",
          a: "It's best practice to let customers know they're chatting with a bot initially, but make it clear they can speak to a human if needed. Most customers appreciate instant responses and don't mind chatting with a bot for simple questions."
        }
      ]
    },
    {
      id: "payment-integration",
      title: "Payment Integration",
      icon: CreditCard,
      description: "Accept payments securely online with multiple payment methods.",
      image: "/Images/Stripe_Logo,_revised_2016.svg.png",
      overview: "Accept payments online securely and easily. We integrate payment processing into your website so customers can pay with credit cards, debit cards, PayPal, Apple Pay, Google Pay, and more. We handle subscriptions, one-time payments, refunds, and everything else related to payments. All transactions are secure and PCI-compliant, meaning customer payment information is protected to the highest standards.",
      whatItMeans: "Payment integration means adding the ability to accept payments on your website. When a customer wants to buy something or pay for a service, they enter their payment information (card number, etc.) and the payment is processed securely. The money goes to your account, and the customer gets a confirmation. We set this up so it's secure, easy for customers to use, and handles everything automatically - including subscriptions, refunds, and international payments.",
      useCases: [
        "You want to sell products or services online",
        "You need to accept payments on your website",
        "You want to offer subscriptions or recurring payments",
        "You need to accept multiple payment methods",
        "You want to sell to customers in different countries",
        "You need to handle refunds and disputes"
      ],
      benefits: [
        "Accept payments 24/7 without manual processing",
        "Multiple payment options increase conversion rates",
        "Secure transactions protect you and your customers",
        "Automatic processing saves time",
        "Handles subscriptions and recurring payments",
        "Works internationally with multiple currencies",
        "Professional checkout builds customer trust",
        "Automatic receipts and confirmations"
      ],
      includes: [
        "Credit and debit card processing (Visa, Mastercard, Amex, etc.)",
        "PayPal integration",
        "Apple Pay and Google Pay for mobile",
        "Subscription and recurring billing setup",
        "One-time payment processing",
        "Secure payment forms that protect customer data",
        "Payment method management (save cards for returning customers)",
        "Automatic invoice generation",
        "Refund and dispute handling",
        "Multi-currency support for international sales",
        "Automatic tax calculation",
        "Payment notifications (email confirmations, receipts)",
        "Payment analytics and reporting",
        "PCI compliance (highest security standards)"
      ],
      process: [
        {
          step: "Choosing Payment Methods",
          description: "We discuss what payment methods you want to accept based on your business needs and customer preferences. We consider cards, PayPal, digital wallets, bank transfers, and regional payment methods. We help you choose what works best."
        },
        {
          step: "Setting Up Accounts",
          description: "We help you set up merchant accounts with payment processors (like Stripe or PayPal). We guide you through the application process and help obtain the necessary credentials and approvals."
        },
        {
          step: "Building Payment System",
          description: "We integrate payment processing into your website - building secure checkout forms, connecting to payment processors, setting up webhooks for payment notifications, and ensuring everything is secure and PCI-compliant."
        },
        {
          step: "Testing Payments",
          description: "We thoroughly test payment processing using test cards and sandbox environments. We test successful payments, failed payments, refunds, subscriptions, and edge cases to ensure everything works correctly."
        },
        {
          step: "Security Review",
          description: "We ensure all security best practices are followed - PCI compliance, secure data handling, proper encryption, and protection against fraud. We review everything to ensure customer payment data is protected."
        },
        {
          step: "Going Live",
          description: "We switch from test mode to live mode, do final checks, and monitor the first transactions. We provide documentation on how payments work and how to handle refunds, disputes, and other payment-related tasks."
        }
      ],
      timeline: "2-4 weeks",
      technologies: ["Stripe", "PayPal", "Square", "Braintree", "Node.js"],
      faq: [
        {
          q: "How much does payment integration cost?",
          a: "Payment integration setup typically costs £500-£2,000+ depending on complexity. Payment processors charge fees per transaction (usually 2-3% + small fixed fee). We'll help you understand all costs upfront."
        },
        {
          q: "What payment methods can I accept?",
          a: "We can integrate credit/debit cards (all major brands), PayPal, Apple Pay, Google Pay, bank transfers, and regional payment methods. We'll discuss what makes sense for your business and customers."
        },
        {
          q: "Is it safe for customers to pay?",
          a: "Yes! We use industry-leading payment processors (like Stripe and PayPal) that handle billions in payments securely. All transactions are encrypted and PCI-compliant. We never store full card numbers - payment processors handle all sensitive data."
        },
        {
          q: "How do I get the money?",
          a: "Money goes directly to your bank account, usually within 2-7 business days depending on the payment processor. You can see all transactions in your payment processor dashboard and download reports."
        },
        {
          q: "What about refunds?",
          a: "You can process refunds easily through your payment processor dashboard, or we can build refund functionality into your admin area. Refunds are processed back to the customer's original payment method."
        },
        {
          q: "Can I accept international payments?",
          a: "Yes! Most payment processors support international payments and can handle currency conversion. We can set up multi-currency support so customers see prices in their local currency."
        }
      ]
    },
    {
      id: "ongoing-support",
      title: "Ongoing Support",
      icon: Wrench,
      description: "Keep your website running smoothly with regular maintenance and support.",
      image: "/Images/Maintainance.png",
      overview: "Your website needs ongoing care to stay secure, fast, and up-to-date. We offer support plans that handle updates, security patches, bug fixes, content updates, and technical issues. You focus on your business while we ensure your website stays in perfect shape. We monitor your site, fix issues quickly, and keep everything running smoothly.",
      whatItMeans: "Ongoing support means we take care of your website after it's launched. We handle security updates to protect against hackers, fix bugs if something breaks, update content if you need changes, add small features, monitor performance, and ensure everything keeps working. It's like having a maintenance team for your website - you don't have to worry about technical issues, we handle them for you.",
      useCases: [
        "You want peace of mind that your website is maintained",
        "You need someone to fix issues quickly when they arise",
        "You want regular security updates to protect your site",
        "You need help updating content occasionally",
        "You want performance monitoring to catch issues early",
        "You need technical support without hiring a developer"
      ],
      benefits: [
        "Peace of mind - your site is always maintained",
        "Quick fixes when issues arise",
        "Security protection from regular updates",
        "Better performance from ongoing optimization",
        "No need to learn technical skills yourself",
        "Focus on your business, not website maintenance"
      ],
      includes: [
        "Regular security updates to protect against threats",
        "Performance monitoring to catch issues early",
        "Bug fixes and troubleshooting when problems arise",
        "Content updates (text, images, pages) when needed",
        "Small feature additions and improvements",
        "Automatic backups so nothing is ever lost",
        "Uptime monitoring to ensure your site is always online",
        "Security scanning to detect vulnerabilities",
        "Dependency updates (keeping software current)",
        "Technical support via email or chat",
        "Monthly reports on site health and performance",
        "Priority response times for urgent issues"
      ],
      process: [
        {
          step: "Onboarding & Assessment",
          description: "We review your website, set up monitoring tools, establish support processes, and create a maintenance plan. We identify what needs regular attention and set up systems to catch issues early."
        },
        {
          step: "Setting Up Monitoring",
          description: "We configure uptime monitoring (to know if your site goes down), error tracking (to catch bugs), performance monitoring (to ensure speed), and security scanning (to detect threats). You'll get alerts if anything needs attention."
        },
        {
          step: "Regular Maintenance",
          description: "We perform scheduled maintenance - security updates, software updates, performance checks, and optimizations. We do this regularly to keep everything current and secure. You don't need to do anything, we handle it."
        },
        {
          step: "Support & Response",
          description: "When you need help or something breaks, we respond quickly. We fix bugs, update content, add features, and solve problems. We communicate clearly about what we're doing and when it will be done."
        }
      ],
      timeline: "Ongoing (monthly or as-needed plans available)",
      technologies: ["Monitoring Tools", "Backup Systems", "Security Tools"],
      faq: [
        {
          q: "How much does ongoing support cost?",
          a: "Support plans typically range from £100-£500+ per month depending on what's included. We offer different tiers - basic maintenance, standard support, and premium support. We can also work on an hourly basis for occasional needs. We'll discuss what makes sense for your website."
        },
        {
          q: "What's included in support?",
          a: "Support includes security updates, bug fixes, performance monitoring, content updates, backups, and technical assistance. The specific inclusions depend on your support plan. We'll customize a plan based on your needs."
        },
        {
          q: "How quickly do you respond to issues?",
          a: "Response times depend on your support plan. Basic plans typically respond within 24-48 hours. Premium plans offer same-day or even same-hour response for urgent issues. We'll discuss response time expectations based on your plan."
        },
        {
          q: "Can I cancel support anytime?",
          a: "Yes, support plans are month-to-month with no long-term contracts. You can cancel anytime, though we recommend ongoing support to keep your website secure and maintained."
        },
        {
          q: "What if I need major changes, not just maintenance?",
          a: "Support plans cover maintenance and small updates. For major new features or redesigns, we can quote those as separate projects. We'll always discuss costs before doing work beyond your support plan."
        }
      ]
    }
  ];

  return (
    <div className="space-y-4">
      {services.map((service) => {
        const Icon = service.icon;
        const isExpanded = expandedService === service.id;

        return (
          <div
            key={service.id}
            id={service.id}
            className="bg-card border border-border rounded-2xl overflow-hidden transition-all hover:shadow-lg scroll-mt-20"
          >
            <button
              onClick={() => toggleService(service.id)}
              className="w-full p-4 sm:p-6 md:p-8 text-left flex items-start gap-3 sm:gap-4 md:gap-6 hover:bg-accent/30 transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-primary" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-heading mb-1 sm:mb-2">{service.title}</h3>
                    <p className="text-muted-foreground text-sm sm:text-base">{service.description}</p>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-muted-foreground flex-shrink-0 transition-transform mt-1 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>
            </button>

            {isExpanded && (
              <div className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8 border-t border-border">
                <div className="pt-4 sm:pt-6 space-y-6 sm:space-y-8">
                  {/* Overview */}
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Overview</h4>
                    <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">{service.overview}</p>
                  </div>

                  {/* What It Means */}
                  {service.whatItMeans && (
                    <div className="bg-muted/50 rounded-lg p-4 sm:p-6">
                      <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 flex items-center gap-2">
                        <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        What This Means
                      </h4>
                      <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">{service.whatItMeans}</p>
                    </div>
                  )}

                  {/* Image if available */}
                  {service.image && (
                    <div className="rounded-xl overflow-hidden bg-muted aspect-video relative">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Use Cases */}
                  {service.useCases && (
                    <div>
                      <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Perfect For You If:</h4>
                      <div className="grid sm:grid-cols-2 gap-2 sm:gap-3">
                        {service.useCases.map((useCase, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm sm:text-base text-muted-foreground">{useCase}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Benefits */}
                  {service.benefits && (
                    <div>
                      <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Benefits:</h4>
                      <div className="grid sm:grid-cols-2 gap-2 sm:gap-3">
                        {service.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm sm:text-base text-muted-foreground">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* What's Included */}
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      What's Included
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-2 sm:gap-3">
                      {service.includes.map((item, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-primary mt-1 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Process */}
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                      <Rocket className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      Our Process
                    </h4>
                    <div className="space-y-3 sm:space-y-4">
                      {service.process.map((step, index) => (
                        <div key={index} className="flex gap-3 sm:gap-4">
                          <div className="flex-shrink-0">
                            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-xs sm:text-sm">
                              {index + 1}
                            </div>
                          </div>
                          <div className="flex-1 pt-0.5 sm:pt-1">
                            <h5 className="font-semibold mb-1 text-sm sm:text-base">{step.step}</h5>
                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Timeline & Technologies */}
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 pt-3 sm:pt-4 border-t border-border">
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold mb-2 flex items-center gap-2">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                        Typical Timeline
                      </h4>
                      <p className="text-sm sm:text-base text-muted-foreground">{service.timeline}</p>
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold mb-2 flex items-center gap-2">
                        <Code className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                        Technologies We Use
                      </h4>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {service.technologies.map((tech, index) => (
                          <span
                            key={index}
                            className="px-2 py-0.5 sm:px-2 sm:py-1 text-xs rounded-md bg-muted text-muted-foreground"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* FAQ */}
                  {service.faq && (
                    <div className="pt-3 sm:pt-4 border-t border-border">
                      <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                        <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        Frequently Asked Questions
                      </h4>
                      <div className="space-y-3 sm:space-y-4">
                        {service.faq.map((faq, index) => (
                          <div key={index} className="bg-muted/30 rounded-lg p-3 sm:p-4">
                            <h5 className="font-semibold mb-1.5 sm:mb-2 text-sm sm:text-base text-foreground">Q: {faq.q}</h5>
                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">A: {faq.a}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
