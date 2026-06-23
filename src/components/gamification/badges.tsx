"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

const defaultBadges = [
  { key: "explorer", icon: "🧭", name: "Kaşif", nameEn: "Explorer", desc: "50+ yeni sanatçı keşfet", color: "#1DB954", unlocked: false },
  { key: "collector", icon: "🎭", name: "Koleksiyoncu", nameEn: "Collector", desc: "10+ farklı tür dinle", color: "#A855F7", unlocked: false },
  { key: "nightowl", icon: "🦉", name: "Gece Kuşu", nameEn: "Night Owl", desc: "Gece 00:00-04:00 arası dinle", color: "#6366F1", unlocked: false },
  { key: "loyalfan", icon: "⭐", name: "Sadık Hayran", nameEn: "Loyal Fan", desc: "Aynı sanatçıyı 30 gün dinle", color: "#F59E0B", unlocked: false },
  { key: "trendsetter", icon: "📈", name: "Trend Yakalayıcı", nameEn: "Trend Setter", desc: "10 yeni çıkış keşfet", color: "#EC4899", unlocked: false },
  { key: "underground", icon: "🔦", name: "Underground", nameEn: "Underground", desc: "Düşük popülerlikli 20 şarkı dinle", color: "#06B6D4", unlocked: false },
];

interface BadgesProps {
  earnedBadgeKeys?: string[];
  lang?: "tr" | "en";
}

export function Badges({ earnedBadgeKeys = [], lang = "tr" }: BadgesProps) {
  const badges = defaultBadges.map((b) => ({ ...b, unlocked: earnedBadgeKeys.includes(b.key) }));

  return (
    <Card>
      <h2 className="text-xl font-bold text-white mb-6">
        {lang === "tr" ? "Rozetler" : "Badges"}
      </h2>
      <div className="grid grid-cols-3 gap-4">
        {badges.map((badge, i) => (
          <motion.div
            key={badge.key}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
              badge.unlocked
                ? "bg-white/10 border border-white/20"
                : "bg-white/5 border border-white/5 opacity-50 grayscale"
            }`}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
              style={{ backgroundColor: `${badge.color}22` }}
            >
              {badge.icon}
            </div>
            <p className="text-white text-xs font-semibold text-center leading-tight">
              {lang === "tr" ? badge.name : badge.nameEn}
            </p>
            {!badge.unlocked && (
              <p className="text-white/30 text-xs text-center leading-tight">{badge.desc}</p>
            )}
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
