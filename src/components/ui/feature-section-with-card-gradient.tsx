import React from "react";

export function FeaturesSectionWithCardGradient() {
  return (
    <div className="py-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {grid.map((feature, index) => (
          <div
            key={feature.title}
            className="relative bg-gradient-to-b dark:from-card from-card dark:to-muted to-muted p-6 rounded-3xl overflow-hidden border border-border"
          >
            <Grid size={20} id={`grid-${index}`} />
            <p className="text-base font-bold text-foreground relative z-20">
              {feature.title}
            </p>
            <p className="text-muted-foreground mt-4 text-base font-normal relative z-20">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

const grid = [
  {
    title: "Fast Turnaround",
    description:
      "Quick delivery without compromising on quality. Most projects completed within 2-6 weeks.",
  },
  {
    title: "Clear Communication",
    description:
      "Regular updates and transparent progress tracking. You're always in the loop.",
  },
  {
    title: "Quality Guaranteed",
    description:
      "Built with modern best practices, tested thoroughly, and optimized for performance.",
  },
  {
    title: "Fair Pricing",
    description:
      "Transparent costs with no hidden fees. 50% deposit, 50% on completion.",
  },
  {
    title: "Ongoing Support",
    description:
      "Post-launch support and maintenance to keep your project running smoothly.",
  },
  {
    title: "Personal Touch",
    description:
      "Dedicated attention to your project with direct communication throughout the process.",
  },
  {
    title: "Modern Technology",
    description:
      "Built with the latest frameworks and tools to ensure your project is future-proof.",
  },
  {
    title: "Proven Process",
    description:
      "Clear milestones, transparent communication, and predictable outcomes every time.",
  },
];

export const Grid = ({
  pattern,
  size,
  id,
}: {
  pattern?: number[][];
  size?: number;
  id?: string;
}) => {
  // Deterministic default pattern for SSR/CSR hydration stability
  const p = pattern ?? [
    [7, 1],
    [8, 3],
    [9, 2],
    [10, 4],
    [11, 5],
  ];
  return (
    <div className="pointer-events-none absolute left-1/2 top-0  -ml-20 -mt-2 h-full w-full [mask-image:linear-gradient(white,transparent)]">
      <div className="absolute inset-0 bg-gradient-to-r  [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-primary/10 from-primary/5 to-primary/10 dark:to-primary/5 opacity-100">
        <GridPattern
          width={size ?? 20}
          height={size ?? 20}
          x="-12"
          y="4"
          squares={p}
          id={id}
          className="absolute inset-0 h-full w-full  mix-blend-overlay dark:fill-primary/10 dark:stroke-primary/10 stroke-primary/10 fill-primary/5"
        />
      </div>
    </div>
  );
};

export function GridPattern({ width, height, x, y, squares, id, ...props }: any) {
  // Use provided ID or generate a deterministic one based on props
  // This ensures consistent IDs between server and client
  const patternId = id || `grid-pattern-${width}-${height}-${x}-${y}`;

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        strokeWidth={0}
        fill={`url(#${patternId})`}
      />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([x, y]: any, index: number) => (
            <rect
              strokeWidth="0"
              key={`${x}-${y}-${index}`}
              width={width + 1}
              height={height + 1}
              x={x * width}
              y={y * height}
            />
          ))}
        </svg>
      )}
    </svg>
  );
}
