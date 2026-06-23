"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Brain, TrendingUp, Moon, Music } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

interface Insight {
  tr: string;
  en: string;
  type: string;
}

interface InsightsData {
  personality: { tr: string; en: string };
  topGenres: string[];
  topArtists: string[];
  nightListeningPercentage: number;
  insights: Insight[];
}

const typeConfig: Record<string, { icon: typeof Brain; color: string }> = {
  genre: { icon: Music, color: "#1DB954" },
  time: { icon: Moon, color: "#6366F1" },
  artist: { icon: TrendingUp, color: "#F59E0B" },
};

interface InsightsPanelProps {
  lang?: "tr" | "en";
}

export function InsightsPanel({ lang = "tr" }: InsightsPanelProps) {
  const [data, setData] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/insights")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-8">
          <Spinner className="w-8 h-8" />
        </div>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <Card>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#1DB954]/20 flex items-center justify-center">
          <Brain className="w-5 h-5 text-[#1DB954]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">
            {lang === "tr" ? "AI Analizi" : "AI Analysis"}
          </h2>
          <p className="text-white/40 text-sm">
            {lang === "tr" ? data.personality.tr : data.personality.en}
          </p>
        </div>
      </div>
      <div className="space-y-4">
        {data.insights.map((insight, i) => {
          const cfg = typeConfig[insight.type] ?? { icon: Music, color: "#1DB954" };
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className="flex gap-4 p-4 rounded-xl bg-white/5"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: `${cfg.color}22` }}
              >
                <cfg.icon className="w-5 h-5" style={{ color: cfg.color }} />
              </div>
              <p className="text-white/80 text-sm leading-relaxed">
                {lang === "tr" ? insight.tr : insight.en}
              </p>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
