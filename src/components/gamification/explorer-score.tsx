"use client";

import { motion } from "framer-motion";
import { Compass, Shuffle, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";

interface ExplorerScoreProps {
  discoveryScore: number;
  diversityScore: number;
  explorerScore: number;
  lang?: "tr" | "en";
}

export function ExplorerScoreCard({
  discoveryScore,
  diversityScore,
  explorerScore,
  lang = "tr",
}: ExplorerScoreProps) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">
          {lang === "tr" ? "Kaşif Skoru" : "Explorer Score"}
        </h2>
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
            <circle
              cx="40"
              cy="40"
              r="32"
              fill="none"
              stroke="#1DB954"
              strokeWidth="8"
              strokeDasharray={`${(explorerScore / 100) * 201} 201`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-black text-xl">{explorerScore}</span>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Compass className="w-4 h-4 text-[#1DB954]" />
            <span className="text-white/70 text-sm">{lang === "tr" ? "Keşif Skoru" : "Discovery Score"}</span>
          </div>
          <ProgressBar value={discoveryScore} color="#1DB954" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Shuffle className="w-4 h-4 text-purple-400" />
            <span className="text-white/70 text-sm">{lang === "tr" ? "Çeşitlilik Skoru" : "Diversity Score"}</span>
          </div>
          <ProgressBar value={diversityScore} color="#A855F7" />
        </div>
      </div>
    </Card>
  );
}
