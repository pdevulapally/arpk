interface DotCardProps {
  title: string;
  description: string;
}

export default function DotCard({ title, description }: DotCardProps) {
  return (
    <div className="relative mx-auto w-full max-w-sm rounded-lg border border-dashed border-border px-4 sm:px-6 md:px-8">
      <div className="absolute top-4 left-0 -z-0 h-px w-full bg-border sm:top-6 md:top-8" />
      <div className="absolute bottom-4 left-0 z-0 h-px w-full bg-border sm:bottom-6 md:bottom-8" />
      <div className="relative w-full border-x border-border">
        <div className="absolute z-0 grid h-full w-full items-center">
          <section className="absolute z-0 grid h-full w-full grid-cols-2 place-content-between">
            <div className="bg-primary my-4 size-1 -translate-x-[2.5px] rounded-full outline outline-8 outline-background sm:my-6 md:my-8" />
            <div className="bg-primary my-4 size-1 translate-x-[2.5px] place-self-end rounded-full outline outline-8 outline-background sm:my-6 md:my-8" />
            <div className="bg-primary my-4 size-1 -translate-x-[2.5px] rounded-full outline outline-8 outline-background sm:my-6 md:my-8" />
            <div className="bg-primary my-4 size-1 translate-x-[2.5px] place-self-end rounded-full outline outline-8 outline-background sm:my-6 md:my-8" />
          </section>
        </div>
        <div className="relative z-20 mx-auto py-8">
          <div className="p-6">
            <h3 className="mb-1 text-lg font-bold text-foreground">
              {title}
            </h3>
            <p className="text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
