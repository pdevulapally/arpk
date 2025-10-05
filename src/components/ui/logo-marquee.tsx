"use client";

import { animate, motion, useMotionValue } from "framer-motion";
import React, { CSSProperties, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

function useMeasure(): [React.RefObject<HTMLDivElement | null>, { width: number; height: number }] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [{ width, height }, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cr = entry.contentRect;
        setSize({ width: cr.width, height: cr.height });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return [ref, { width, height }];
}

type InfiniteSliderProps = {
  children: React.ReactNode;
  gap?: number;
  speed?: number;
  speedOnHover?: number;
  direction?: "horizontal" | "vertical";
  reverse?: boolean;
  className?: string;
};

function InfiniteSlider({
  children,
  gap = 16,
  speed = 100,
  speedOnHover,
  direction = "horizontal",
  reverse = false,
  className,
}: InfiniteSliderProps) {
  const [currentSpeed, setCurrentSpeed] = useState(speed);
  const [ref, { width, height }] = useMeasure();
  const translation = useMotionValue(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    let controls: any;
    const size = direction === "horizontal" ? width : height;
    if (size === 0) return;

    const contentSize = size + gap;
    const from = reverse ? -contentSize / 2 : 0;
    const to = reverse ? 0 : -contentSize / 2;

    const distanceToTravel = Math.abs(to - from);
    const duration = distanceToTravel / currentSpeed;

    if (isTransitioning) {
      const remainingDistance = Math.abs((translation.get?.() ?? 0) - to);
      const transitionDuration = remainingDistance / currentSpeed;
      controls = animate(translation, [translation.get?.() ?? 0, to], {
        ease: "linear",
        duration: transitionDuration,
        onComplete: () => {
          setIsTransitioning(false);
          setKey((prevKey) => prevKey + 1);
        },
      });
    } else {
      controls = animate(translation, [from, to], {
        ease: "linear",
        duration,
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0,
        onRepeat: () => {
          translation.set(from);
        },
      });
    }

    return () => controls?.stop?.();
  }, [key, translation, currentSpeed, width, height, gap, isTransitioning, direction, reverse]);

  const hoverProps = speedOnHover
    ? {
        onHoverStart: () => {
          setIsTransitioning(true);
          setCurrentSpeed(speedOnHover);
        },
        onHoverEnd: () => {
          setIsTransitioning(true);
          setCurrentSpeed(speed);
        },
      }
    : {};

  return (
    <div className={cn("overflow-hidden", className)}>
      <motion.div
        className="flex w-max"
        style={{
          ...(direction === "horizontal" ? { x: translation } : { y: translation }),
          gap: `${gap}px`,
          flexDirection: direction === "horizontal" ? "row" : "column",
        }}
        ref={ref}
        {...hoverProps}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

export type BlurredInfiniteSliderProps = InfiniteSliderProps & {
  fadeWidth?: number;
  containerClassName?: string;
};

export function BlurredInfiniteSlider({
  children,
  fadeWidth = 80,
  containerClassName,
  ...sliderProps
}: BlurredInfiniteSliderProps) {
  const maskStyle: CSSProperties = {
    maskImage: `linear-gradient(to right, transparent, black ${fadeWidth}px, black calc(100% - ${fadeWidth}px), transparent)`,
    WebkitMaskImage: `linear-gradient(to right, transparent, black ${fadeWidth}px, black calc(100% - ${fadeWidth}px), transparent)`,
  };

  return (
    <div className={cn("relative w-full", containerClassName)} style={maskStyle}>
      <InfiniteSlider
        gap={sliderProps.gap ?? 96}
        speed={sliderProps.speed ?? 60}
        speedOnHover={sliderProps.speedOnHover}
        direction={sliderProps.direction}
        reverse={sliderProps.reverse}
        className={cn("[--gap:48px] sm:[--gap:96px]", sliderProps.className)}
      >
        {children}
      </InfiniteSlider>
    </div>
  );
}

const LOGOS = [
  { src: "/Images/Firebase_Logo.png", alt: "Firebase" },
  { src: "/Images/Netlify_logo_(2).svg", alt: "Netlify" },
  { src: "/Images/next-js-logo-freelogovectors.net_.png", alt: "Next.js", className: "h-10 w-40 sm:h-12 sm:w-48" },
  { src: "/Images/Stripe_Logo,_revised_2016.svg.png", alt: "Stripe" },
  { src: "/Images/vercel-text.png", alt: "Vercel" },
  { src: "/Images/supabase-8x.png", alt: "Supabase" },
];

export function LogoMarquee() {
  return (
    <section className="bg-background/50 overflow-hidden py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center md:flex-row gap-4">
          <div className="flex-shrink-0 text-center md:text-right md:max-w-44 md:border-r md:border-border md:pr-6">
            <p className="text-sm text-muted-foreground">Trusted tooling</p>
          </div>
          <div className="w-full py-4 sm:py-6 md:w-auto md:flex-1">
            <BlurredInfiniteSlider speedOnHover={20} speed={50} gap={96} fadeWidth={48}>
              {LOGOS.map((logo) => (
                <div key={logo.src} className="flex">
                  <img className={cn("mx-auto h-6 w-24 sm:h-8 sm:w-32 object-contain", (logo as any).className)} src={logo.src} alt={logo.alt} />
                </div>
              ))}
            </BlurredInfiniteSlider>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LogoMarquee;


