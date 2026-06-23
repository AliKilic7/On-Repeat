"use client";

import { motion } from "framer-motion";
import { Music, Mic2, Layers, Flame, Clock } from "lucide-react";

interface StatsGridProps {
  topTracksCount: number;
  uniqueArtistsCount: number;
  uniqueGenresCount: number;
  avgPopularity: number;
  totalListeningTimeMs?: number;
}

function formatListeningTime(ms: number): string {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  if (hours > 0) return `${hours}s ${minutes}d`;
  return `${minutes}d`;
}

export function StatsGrid({ topTracksCount, uniqueArtistsCount, uniqueGenresCount, avgPopularity, totalListeningTimeMs }: StatsGridProps) {
  const stats = [
    { icon: Music,  value: topTracksCount.toString(),                                              label: "Top Parça",       color: "#1DB954", glow: "rgba(29,185,84,0.15)"  },
    { icon: Mic2,   value: uniqueArtistsCount.toString(),                                          label: "Sanatçı",         color: "#3B82F6", glow: "rgba(59,130,246,0.15)" },
    { icon: Layers, value: uniqueGenresCount > 0 ? uniqueGenresCount.toString() : "—",            label: "Müzik Türü",      color: "#A855F7", glow: "rgba(168,85,247,0.15)" },
    { icon: Flame,  value: avgPopularity > 0 ? `${avgPopularity}` : "—",                          label: "Ort. Popülerlik", color: "#F59E0B", glow: "rgba(245,158,11,0.15)" },
    { icon: Clock,  value: totalListeningTimeMs ? formatListeningTime(totalListeningTimeMs) : "—", label: "Son Dinleme",     color: "#EC4899", glow: "rgba(236,72,153,0.15)" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {stats.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
          className="bg-[#111118] border border-white/[0.06] rounded-2xl p-4 hover:border-white/[0.1] transition-colors"
        >
          <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3" style={{ background: s.glow }}>
            <s.icon className="w-4 h-4" style={{ color: s.color }} />
          </div>
          <p className="text-xl font-bold text-white leading-none mb-1">{s.value}</p>
          <p className="text-xs text-white/35 font-medium">{s.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
