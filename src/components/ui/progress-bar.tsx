import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  className?: string;
  label?: string;
}

export function ProgressBar({ value, max = 100, color = "#1DB954", className, label }: ProgressBarProps) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className={cn("w-full", className)}>
      {label && <p className="text-xs text-white/60 mb-1">{label}</p>}
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
