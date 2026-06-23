"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Music2, BarChart3, Users, Sparkles, Gift, Brain, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: BarChart3,  labelTr: "Analiz",    labelEn: "Analytics" },
  { href: "/wrapped",   icon: Gift,        labelTr: "Wrapped",   labelEn: "Wrapped"   },
  { href: "/discover",  icon: Sparkles,    labelTr: "Keşfet",    labelEn: "Discover"  },
  { href: "/insights",  icon: Brain,       labelTr: "İçgörüler", labelEn: "Insights"  },
  { href: "/social",    icon: Users,       labelTr: "Sosyal",    labelEn: "Social"    },
];

export function Navbar({ lang = "tr" }: { lang?: "tr" | "en" }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/[0.05]">
      <div className="px-4 sm:px-6 lg:px-10 flex items-center justify-between h-14">

        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-[#1DB954] flex items-center justify-center">
            <Music2 className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-white text-sm">On Repeat</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-0.5">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all",
                  active
                    ? "bg-white/[0.08] text-white"
                    : "text-white/40 hover:text-white/80 hover:bg-white/[0.05]"
                )}
              >
                <item.icon className={cn("w-3.5 h-3.5", active && "text-[#1DB954]")} />
                {lang === "tr" ? item.labelTr : item.labelEn}
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {session?.user && (
            <div className="hidden md:flex items-center gap-2">
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name ?? ""}
                  width={28}
                  height={28}
                  className="rounded-full ring-1 ring-white/10"
                />
              )}
              <span className="text-xs text-white/40 font-medium">
                {session.user.name?.split(" ")[0]}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="ml-1 p-1.5 rounded-lg text-white/25 hover:text-white/60 hover:bg-white/[0.06] transition-all"
                title="Çıkış"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          <button
            className="md:hidden p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-all"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/[0.05] bg-[#0a0a0f]/98 backdrop-blur-xl px-4 py-2">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all mb-0.5",
                  active ? "bg-white/[0.08] text-white" : "text-white/40 hover:text-white hover:bg-white/[0.05]"
                )}
              >
                <item.icon className={cn("w-4 h-4", active && "text-[#1DB954]")} />
                <span className="text-sm font-medium">{lang === "tr" ? item.labelTr : item.labelEn}</span>
              </Link>
            );
          })}
          {session?.user && (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/30 hover:text-white/60 hover:bg-white/[0.05] transition-all w-full mt-1 mb-1"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Çıkış Yap</span>
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
