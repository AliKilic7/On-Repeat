"use client";

import { motion } from "framer-motion";
import { Clock, Music, Mic2, Globe } from "lucide-react";
import { formatDuration, formatDurationEn } from "@/lib/utils";

interface StatsGridProps {
  totalListeningTimeMs: number;
  uniqueTracksCount: number;
  uniqueArtistsCount: number;
  topGenresCount: number;
  lang?: "tr" | "en";
}

export function StatsGrid({
  totalListeningTimeMs,
  uniqueTracksCount,
  uniqueArtistsCount,
  topGenresCount,
  lang = "tr",
}: StatsGridProps) {
  const stats = [
    {
      icon: Clock,
      value: lang === "tr" ? formatDuration(totalListeningTimeMs) : formatDurationEn(totalListeningTimeMs),
      label: lang === "tr" ? "Toplam Süre" : "Total Time",
      color: "#1DB954",
    },
    {
      icon: Music,
      value: uniqueTracksCount.toString(),
      label: lang === "tr" ? "Farklı Parça" : "Unique Tracks",
      color: "#A855F7",
    },
    {
      icon: Mic2,
      value: uniqueArtistsCount.toString(),
      label: lang === "tr" ? "Farklı Sanatçı" : "Unique Artists",
      color: "#3B82F6",
    },
    {
      icon: Globe,
      value: topGenresCount.toString(),
      label: lang === "tr" ? "Farklı Tür" : "Genres",
      color: "#F59E0B",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 flex flex-col gap-3"
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${stat.color}22` }}
          >
            <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-white/50 text-sm mt-0.5">{stat.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
