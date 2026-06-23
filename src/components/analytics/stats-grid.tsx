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
      bg: "rgba(29,185,84,0.08)",
    },
    {
      icon: Music,
      value: uniqueTracksCount.toLocaleString(),
      label: lang === "tr" ? "Farklı Parça" : "Unique Tracks",
      color: "#A855F7",
      bg: "rgba(168,85,247,0.08)",
    },
    {
      icon: Mic2,
      value: uniqueArtistsCount.toLocaleString(),
      label: lang === "tr" ? "Farklı Sanatçı" : "Unique Artists",
      color: "#3B82F6",
      bg: "rgba(59,130,246,0.08)",
    },
    {
      icon: Globe,
      value: topGenresCount.toString(),
      label: lang === "tr" ? "Müzik Türü" : "Genres",
      color: "#F59E0B",
      bg: "rgba(245,158,11,0.08)",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="rounded-2xl border border-white/[0.07] p-5 flex flex-col gap-4"
          style={{ backgroundColor: stat.bg }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${stat.color}18` }}
          >
            <stat.icon className="w-4.5 h-4.5" style={{ color: stat.color }} />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-white leading-none">{stat.value}</p>
            <p className="text-white/40 text-xs mt-1.5 font-medium">{stat.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
