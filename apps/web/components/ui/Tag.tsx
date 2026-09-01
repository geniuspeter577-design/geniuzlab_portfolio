import { cn } from "@/lib/utils";

interface TagProps {
  children: React.ReactNode;
  className?: string;
}

/** Small mono label used for categories, metadata, and image captions. */
export function Tag({ children, className }: TagProps) {
  return (
    <span
      className={cn(
        "eyebrow inline-flex items-center border border-ink/20 px-2.5 py-1 text-ink-muted",
        className
      )}
    >
      {children}
    </span>
  );
}
