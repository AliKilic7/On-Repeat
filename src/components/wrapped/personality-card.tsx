"use client";

import { motion } from "framer-motion";
import { getMusicPersonality } from "@/lib/utils";

interface PersonalityCardProps {
  topGenres: string[];
  listeningByHour: Record<number, number>;
  lang?: "tr" | "en";
}

const personalityConfig: Record<string, { emoji: string; color: string; bg: string }> = {
  "Gece Dinleyicisi": { emoji: "🌙", color: "#6366F1", bg: "from-indigo-900/40" },
  "Night Listener": { emoji: "🌙", color: "#6366F1", bg: "from-indigo-900/40" },
  "Nostalji Avcısı": { emoji: "📻", color: "#F59E0B", bg: "from-amber-900/40" },
  "Nostalgia Hunter": { emoji: "📻", color: "#F59E0B", bg: "from-amber-900/40" },
  "Indie Kaşifi": { emoji: "🎸", color: "#10B981", bg: "from-emerald-900/40" },
  "Indie Explorer": { emoji: "🎸", color: "#10B981", bg: "from-emerald-900/40" },
  "Rock Tutkunu": { emoji: "🤘", color: "#EF4444", bg: "from-red-900/40" },
  "Rock Enthusiast": { emoji: "🤘", color: "#EF4444", bg: "from-red-900/40" },
  "Tür Koleksiyoncusu": { emoji: "🎭", color: "#A855F7", bg: "from-purple-900/40" },
  "Genre Collector": { emoji: "🎭", color: "#A855F7", bg: "from-purple-900/40" },
  "Hit Avcısı": { emoji: "🎯", color: "#1DB954", bg: "from-green-900/40" },
  "Hit Hunter": { emoji: "🎯", color: "#1DB954", bg: "from-green-900/40" },
  "Underground Kaşifi": { emoji: "🔦", color: "#06B6D4", bg: "from-cyan-900/40" },
  "Underground Explorer": { emoji: "🔦", color: "#06B6D4", bg: "from-cyan-900/40" },
};

export function PersonalityCard({ topGenres, listeningByHour, lang = "tr" }: PersonalityCardProps) {
  const personality = getMusicPersonality(topGenres, listeningByHour, lang);
  const config = personalityConfig[personality] ?? { emoji: "🎵", color: "#1DB954", bg: "from-green-900/40" };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${config.bg} to-[#0d0d1a] border border-white/10 p-8`}
    >
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-30" style={{ backgroundColor: config.color }} />
      <div className="relative z-10 text-center">
        <div className="text-6xl mb-4">{config.emoji}</div>
        <p className="text-white/60 text-sm font-medium mb-2">
          {lang === "tr" ? "Müzik Kişiliğin" : "Your Music Personality"}
        </p>
        <h2 className="text-3xl font-black mb-4" style={{ color: config.color }}>
          {personality}
        </h2>
        <div className="flex flex-wrap justify-center gap-2">
          {topGenres.slice(0, 4).map((g) => (
            <span key={g} className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/70">
              {g}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
