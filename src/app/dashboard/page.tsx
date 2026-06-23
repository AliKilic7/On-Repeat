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

const timeRanges: { value: TimeRange; labelTr: string; labelEn: string }[] = [
  { value: "short_term", labelTr: "Son 4 Hafta", labelEn: "Last 4 Weeks" },
  { value: "medium_term", labelTr: "Son 6 Ay", labelEn: "Last 6 Months" },
  { value: "long_term", labelTr: "Tüm Zamanlar", labelEn: "All Time" },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("short_term");
  const [lang] = useState<"tr" | "en">("tr");

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
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d1a]">
      <Navbar lang={lang} />
      <main className="pt-20 pb-12 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 mb-8"
        >
          <h1 className="text-3xl font-black text-white mb-1">
            {lang === "tr" ? "Müzik Analizin" : "Your Music Analytics"}
          </h1>
          <p className="text-white/50">
            {lang === "tr"
              ? `Merhaba, ${session.user.name?.split(" ")[0]}!`
              : `Hello, ${session.user.name?.split(" ")[0]}!`}
          </p>
        </motion.div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {timeRanges.map((tr) => (
            <button
              key={tr.value}
              onClick={() => setTimeRange(tr.value)}
              className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                timeRange === tr.value
                  ? "bg-[#1DB954] text-black"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              {lang === "tr" ? tr.labelTr : tr.labelEn}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Spinner className="w-12 h-12" />
          </div>
        ) : data ? (
          <div className="space-y-6">
            <StatsGrid
              totalListeningTimeMs={data.totalListeningTimeMs}
              uniqueTracksCount={data.uniqueTracksCount}
              uniqueArtistsCount={data.uniqueArtistsCount}
              topGenresCount={data.topGenres.length}
              lang={lang}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TopTracks tracks={data.topTracks} lang={lang} />
              <TopArtists artists={data.topArtists} lang={lang} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GenreChart genres={data.topGenres} lang={lang} />
              <ListeningHeatmap listeningByHour={data.listeningByHour} lang={lang} />
            </div>
            <WeekdayChart
              listeningByDayOfWeek={data.listeningByDayOfWeek}
              weekdayVsWeekend={data.weekdayVsWeekend}
              lang={lang}
            />
          </div>
        ) : (
          <div className="text-center py-32 text-white/40">
            {lang === "tr" ? "Veri yüklenemedi." : "Failed to load data."}
          </div>
        )}
      </main>
    </div>
  );
}
