"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { TopTracks } from "@/components/analytics/top-tracks";
import { TopArtists } from "@/components/analytics/top-artists";
import { GenreChart } from "@/components/analytics/genre-chart";
import { ListeningHeatmap } from "@/components/analytics/listening-heatmap";
import { StatsGrid } from "@/components/analytics/stats-grid";
import { WeekdayChart } from "@/components/wrapped/weekday-chart";
import { Spinner } from "@/components/ui/spinner";
import { AnalyticsData } from "@/types";

type TimeRange = "short_term" | "medium_term" | "long_term";

const timeRanges = [
  { value: "short_term" as TimeRange,  label: "4 Hafta" },
  { value: "medium_term" as TimeRange, label: "6 Ay"    },
  { value: "long_term" as TimeRange,   label: "Tüm Zamanlar" },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("short_term");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  useEffect(() => {
    if (!session) return;
    setLoading(true);
    fetch(`/api/analytics?time_range=${timeRange}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [session, timeRange]);

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-8 mb-7 flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-white/35 text-sm font-medium mb-1">Hoş geldin, {session.user.name?.split(" ")[0]} 👋</p>
            <h1 className="text-2xl font-bold text-white">Müzik Analizin</h1>
          </div>

          {/* Time range selector */}
          <div className="flex items-center bg-[#111118] border border-white/[0.06] rounded-xl p-1 gap-0.5">
            {timeRanges.map((tr) => (
              <button
                key={tr.value}
                onClick={() => setTimeRange(tr.value)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  timeRange === tr.value
                    ? "bg-[#1DB954] text-black"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                {tr.label}
              </button>
            ))}
          </div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-40">
            <Spinner className="w-10 h-10" />
          </div>
        ) : data ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="space-y-5">
            <StatsGrid
              topTracksCount={data.topTracksCount}
              uniqueArtistsCount={data.uniqueArtistsCount}
              uniqueGenresCount={data.uniqueGenresCount}
              avgPopularity={data.avgPopularity}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <TopTracks tracks={data.topTracks} />
              <TopArtists artists={data.topArtists} />
            </div>
            <GenreChart genres={data.topGenres} />

            {/* Recent listening section — Spotify API only exposes the last ~50 plays */}
            <div className="pt-4">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-sm font-semibold text-white">Son Dinleme Alışkanlıkların</h2>
                <span className="text-[11px] text-white/30 bg-white/[0.04] px-2 py-0.5 rounded-md">
                  son {data.recentPlaysCount} parça
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <ListeningHeatmap listeningByHour={data.listeningByHour} />
                <WeekdayChart listeningByDayOfWeek={data.listeningByDayOfWeek} weekdayVsWeekend={data.weekdayVsWeekend} />
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-40 text-white/25 text-sm">Veri yüklenemedi.</div>
        )}
      </main>
    </div>
  );
}
