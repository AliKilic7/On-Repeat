"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Music, BarChart3, Users, Sparkles, Gift, Brain, LogOut } from "lucide-react";
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
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#0a0a14]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-[#1DB954] flex items-center justify-center shadow-lg shadow-[#1DB954]/20 group-hover:shadow-[#1DB954]/40 transition-shadow">
              <Music className="w-4 h-4 text-black" />
            </div>
            <span className="font-bold text-white text-[15px] tracking-tight">On Repeat</span>
          </Link>

          <div className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all",
                    active
                      ? "bg-white/10 text-white"
                      : "text-white/50 hover:text-white hover:bg-white/[0.06]"
                  )}
                >
                  <item.icon className={cn("w-4 h-4", active ? "text-[#1DB954]" : "")} />
                  {lang === "tr" ? item.labelTr : item.labelEn}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            {session?.user && (
              <div className="hidden md:flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {session.user.image && (
                    <Image
                      src={session.user.image}
                      alt={session.user.name ?? ""}
                      width={30}
                      height={30}
                      className="rounded-full ring-2 ring-[#1DB954]/30"
                    />
                  )}
                  <span className="text-sm text-white/60 font-medium">
                    {session.user.name?.split(" ")[0]}
                  </span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/70 transition-colors px-2 py-1.5 rounded-lg hover:bg-white/[0.06]"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  {lang === "tr" ? "Çıkış" : "Sign Out"}
                </button>
              </div>
            )}
            <button
              className="md:hidden text-white/50 hover:text-white p-1 rounded-lg hover:bg-white/[0.06] transition-all"
              onClick={() => setOpen(!open)}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/[0.06] bg-[#0a0a14]/98 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-0.5">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                    active ? "bg-white/10 text-white" : "text-white/50 hover:text-white hover:bg-white/[0.06]"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", active ? "text-[#1DB954]" : "")} />
                  <span className="font-medium">{lang === "tr" ? item.labelTr : item.labelEn}</span>
                </Link>
              );
            })}
            {session?.user && (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-all w-full"
              >
                <LogOut className="w-5 h-5" />
                <span>{lang === "tr" ? "Çıkış Yap" : "Sign Out"}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
