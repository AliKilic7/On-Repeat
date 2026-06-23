"use client";

import { motion } from "framer-motion";
import { Clock, Music, Mic2, Layers } from "lucide-react";
import { formatDuration } from "@/lib/utils";

interface StatsGridProps {
  totalListeningTimeMs: number;
  uniqueTracksCount: number;
  uniqueArtistsCount: number;
  topGenresCount: number;
}

const stats = (total: number, tracks: number, artists: number, genres: number) => [
  { icon: Clock,  value: formatDuration(total),         label: "Dinleme Süresi", color: "#1DB954", glow: "rgba(29,185,84,0.15)"   },
  { icon: Music,  value: tracks.toLocaleString("tr"),   label: "Farklı Parça",   color: "#3B82F6", glow: "rgba(59,130,246,0.15)"  },
  { icon: Mic2,   value: artists.toLocaleString("tr"),  label: "Farklı Sanatçı", color: "#A855F7", glow: "rgba(168,85,247,0.15)" },
  { icon: Layers, value: genres.toString(),             label: "Müzik Türü",     color: "#F59E0B", glow: "rgba(245,158,11,0.15)"  },
];

export function StatsGrid({ totalListeningTimeMs, uniqueTracksCount, uniqueArtistsCount, topGenresCount }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats(totalListeningTimeMs, uniqueTracksCount, uniqueArtistsCount, topGenresCount).map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
          className="bg-[#111118] border border-white/[0.06] rounded-2xl p-4 hover:border-white/[0.1] transition-colors"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: s.glow }}>
              <s.icon className="w-4 h-4" style={{ color: s.color }} />
            </div>
          </div>
          <p className="text-xl font-bold text-white leading-none mb-1">{s.value}</p>
          <p className="text-xs text-white/35 font-medium">{s.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
