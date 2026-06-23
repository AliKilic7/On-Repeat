import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export function Card({ className, glass, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/[0.07] p-6",
        glass
          ? "bg-white/[0.04] backdrop-blur-xl"
          : "bg-[#111827]/80",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
