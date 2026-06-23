import { cn } from "@/lib/utils";

interface BadgePillProps {
  label: string;
  color?: string;
  className?: string;
}

export function BadgePill({ label, color = "#1DB954", className }: BadgePillProps) {
  return (
    <span
      className={cn("inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold", className)}
      style={{ backgroundColor: `${color}22`, color, border: `1px solid ${color}44` }}
    >
      {label}
    </span>
  );
}
