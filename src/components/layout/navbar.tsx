"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Music, BarChart3, Users, Sparkles, Gift, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: BarChart3, labelTr: "Analiz", labelEn: "Analytics" },
  { href: "/wrapped", icon: Gift, labelTr: "Wrapped", labelEn: "Wrapped" },
  { href: "/discover", icon: Sparkles, labelTr: "Keşfet", labelEn: "Discover" },
  { href: "/insights", icon: Brain, labelTr: "İçgörüler", labelEn: "Insights" },
  { href: "/social", icon: Users, labelTr: "Sosyal", labelEn: "Social" },
];

interface NavbarProps {
  lang?: "tr" | "en";
}

export function Navbar({ lang = "tr" }: NavbarProps) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0d0d1a]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#1DB954] flex items-center justify-center">
              <Music className="w-4 h-4 text-black" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">SelfMeat</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
              >
                <item.icon className="w-4 h-4" />
                {lang === "tr" ? item.labelTr : item.labelEn}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {session?.user && (
              <div className="flex items-center gap-2">
                {session.user.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name ?? ""}
                    width={32}
                    height={32}
                    className="rounded-full ring-2 ring-[#1DB954]/50"
                  />
                )}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="hidden md:block text-sm text-white/50 hover:text-white transition-colors"
                >
                  {lang === "tr" ? "Çıkış" : "Sign Out"}
                </button>
              </div>
            )}
            <button
              className="md:hidden text-white/70 hover:text-white"
              onClick={() => setOpen(!open)}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 bg-[#0d0d1a]/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all"
              >
                <item.icon className="w-5 h-5" />
                <span>{lang === "tr" ? item.labelTr : item.labelEn}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
