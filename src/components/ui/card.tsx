import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export function Card({ className, glass, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-6",
        glass
          ? "bg-white/[0.03] backdrop-blur-xl border-white/[0.06]"
          : "bg-[#111118] border-white/[0.06]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
