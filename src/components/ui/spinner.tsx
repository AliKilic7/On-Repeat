import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return (
    <div className={cn("animate-spin rounded-full border-2 border-white/20 border-t-[#1DB954]", className)} />
  );
}
