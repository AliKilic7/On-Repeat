"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Brain, Music, Moon, TrendingUp, Compass, Shuffle, Sun } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Spinner } from "@/components/ui/spinner";
import { getMusicPersonality } from "@/lib/utils";

interface InsightItem { tr: string; en: string; type: string; }
interface InsightsData {
  personality: { tr: string; en: string };
  topGenres: string[];
  topArtists: string[];
  nightListeningPercentage: number;
  avgPopularity: number;
  insights: InsightItem[];
  explorerScore?: { discoveryScore: number; diversityScore: number; explorerScore: number };
}

const typeConfig: Record<string, { icon: typeof Brain; color: string }> = {
  genre:  { icon: Music,      color: "#1DB954" },
  time:   { icon: Moon,       color: "#6366F1" },
  artist: { icon: TrendingUp, color: "#F59E0B" },
};

const badgeList = [
  { key: "explorer",    icon: "🧭", name: "Kaşif",           desc: "50+ yeni sanatçı keşfet",            color: "#1DB954" },
  { key: "collector",   icon: "🎭", name: "Koleksiyoncu",    desc: "10+ farklı tür dinle",               color: "#A855F7" },
  { key: "nightowl",    icon: "🦉", name: "Gece Kuşu",       desc: "Gece 00–04 arası dinle",             color: "#6366F1" },
  { key: "loyalfan",    icon: "⭐", name: "Sadık Hayran",    desc: "Aynı sanatçıyı 30 gün dinle",        color: "#F59E0B" },
  { key: "trendsetter", icon: "📈", name: "Trend Takipçisi", desc: "10 yeni çıkış keşfet",               color: "#EC4899" },
  { key: "underground", icon: "🔦", name: "Underground",     desc: "Düşük popülerlikli 20 şarkı dinle",  color: "#06B6D4" },
];

const personalityEmoji: Record<string, string> = {
  "Gece Dinleyicisi": "🌙", "Night Listener": "🌙",
  "Hit Avcısı": "🎯", "Hit Hunter": "🎯",
  "Indie Kaşifi": "🎸", "Indie Explorer": "🎸",
  "Rock Tutkunu": "🤘", "Rock Enthusiast": "🤘",
  "Tür Koleksiyoncusu": "🎭", "Genre Collector": "🎭",
  "Underground Kaşifi": "🔦", "Underground Explorer": "🔦",
  "Nostalji Avcısı": "📻", "Nostalgia Hunter": "📻",
};

export default function InsightsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [insightsData, setInsightsData] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/insights")
      .then(r => r.json())
      .then(ins => { setInsightsData(ins); setLoading(false); })
      .catch(() => setLoading(false));
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  if (!insightsData || !insightsData.insights) {
    return (
      <div className="min-h-screen bg-[#0a0a0f]">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16">
          <div className="mt-8 text-center py-32 text-white/25 text-sm">İçgörüler yüklenemedi.</div>
        </main>
      </div>
    );
  }

  const personality = insightsData.personality?.tr ?? "—";
  const emoji = personalityEmoji[personality] ?? "🎵";
  const explorerScore = insightsData.explorerScore ?? { discoveryScore: 0, diversityScore: 0, explorerScore: 0 };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16">
        <div className="mt-8 mb-7">
          <h1 className="text-2xl font-bold text-white mb-1">İçgörüler</h1>
          <p className="text-sm text-white/35">Müzik zevkinin derinlemesine analizi</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Left col */}
          <div className="space-y-4">
            {/* Personality */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#1DB954]/10 to-[#111118] border border-[#1DB954]/20 rounded-2xl p-6 text-center">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-[#1DB954]/10 blur-2xl" />
              <p className="text-4xl mb-3">{emoji}</p>
              <p className="text-xs text-white/35 font-medium mb-1 uppercase tracking-wider">Müzik Kişiliğin</p>
              <h2 className="text-2xl font-black text-[#1DB954] mb-4">{personality}</h2>
              {insightsData.topGenres.length > 0 && (
                <div className="flex flex-wrap justify-center gap-1.5">
                  {insightsData.topGenres.slice(0, 5).map((g: string) => (
                    <span key={g} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/[0.06] text-white/50 capitalize">{g}</span>
                  ))}
                </div>
              )}
            </div>

            {/* AI Insights */}
            {insightsData.insights.length > 0 && (
              <div className="bg-[#111118] border border-white/[0.06] rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-[#1DB954]/10 flex items-center justify-center">
                    <Brain className="w-3.5 h-3.5 text-[#1DB954]" />
                  </div>
                  <h2 className="text-sm font-semibold text-white">Analiz</h2>
                  <span className="ml-auto text-[11px] text-white/25 bg-white/[0.04] px-2 py-0.5 rounded-md">{insightsData.insights.length} içgörü</span>
                </div>
                <div className="space-y-2">
                  {insightsData.insights.map((insight, i) => {
                    const cfg = typeConfig[insight.type] ?? typeConfig.genre;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="flex gap-3 p-3 rounded-xl bg-white/[0.03]"
                      >
                        <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: `${cfg.color}18` }}>
                          <cfg.icon className="w-3.5 h-3.5" style={{ color: cfg.color }} />
                        </div>
                        <p className="text-white/65 text-xs leading-relaxed">{insight.tr}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right col */}
          <div className="space-y-4">
            {/* Explorer Score — now from real data */}
            <div className="bg-[#111118] border border-white/[0.06] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-semibold text-white">Kaşif Skoru</h2>
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                    <circle cx="32" cy="32" r="26" fill="none" stroke="#1DB954" strokeWidth="6"
                      strokeDasharray={`${(explorerScore.explorerScore / 100) * 163} 163`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-black text-sm">{explorerScore.explorerScore}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { icon: Compass, label: "Keşif Skoru",      value: explorerScore.discoveryScore, color: "#1DB954" },
                  { icon: Shuffle, label: "Çeşitlilik Skoru", value: explorerScore.diversityScore,  color: "#A855F7" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <s.icon className="w-3.5 h-3.5" style={{ color: s.color }} />
                        <span className="text-xs text-white/50">{s.label}</span>
                      </div>
                      <span className="text-xs font-semibold" style={{ color: s.color }}>{s.value}</span>
                    </div>
                    <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${s.value}%`, backgroundColor: s.color, opacity: 0.7 }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Avg popularity */}
              {insightsData.avgPopularity > 0 && (
                <div className="mt-4 pt-4 border-t border-white/[0.05]">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-xs text-white/50">Ort. Popülerlik</span>
                    </div>
                    <span className="text-xs font-semibold text-amber-400">{insightsData.avgPopularity}</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-amber-400/60 transition-all duration-700" style={{ width: `${insightsData.avgPopularity}%` }} />
                  </div>
                </div>
              )}
            </div>

            {/* Badges */}
            <div className="bg-[#111118] border border-white/[0.06] rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-white mb-4">Rozetler</h2>
              <div className="grid grid-cols-3 gap-2">
                {badgeList.map((badge, i) => {
                  // Unlock based on real data
                  const earned =
                    (badge.key === "nightowl" && insightsData.nightListeningPercentage > 25) ||
                    (badge.key === "collector" && insightsData.topGenres.length >= 8) ||
                    (badge.key === "underground" && explorerScore.discoveryScore > 40);
                  return (
                    <motion.div
                      key={badge.key}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${earned ? "bg-white/[0.05] border-white/[0.08]" : "bg-white/[0.02] border-white/[0.03] opacity-40"}`}
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: `${badge.color}${earned ? "28" : "10"}` }}>
                        {badge.icon}
                      </div>
                      <p className={`text-[10px] font-medium text-center leading-tight ${earned ? "text-white/70" : "text-white/40"}`}>{badge.name}</p>
                      <p className="text-white/20 text-[9px] text-center leading-tight">{badge.desc}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
