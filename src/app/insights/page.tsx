"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { InsightsPanel } from "@/components/ai/insights-panel";
import { PersonalityCard } from "@/components/wrapped/personality-card";
import { ExplorerScoreCard } from "@/components/gamification/explorer-score";
import { Badges } from "@/components/gamification/badges";
import { Spinner } from "@/components/ui/spinner";

export default function InsightsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [lang] = useState<"tr" | "en">("tr");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  useEffect(() => {
    if (!session) return;
    fetch("/api/analytics?time_range=short_term")
      .then((r) => r.json())
      .then(setAnalyticsData);
  }, [session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="w-10 h-10" />
      </div>
    );
  }

  const topGenres = analyticsData?.topGenres?.map((g: any) => g.genre) ?? [];
  const listeningByHour = analyticsData?.listeningByHour ?? {};

  return (
    <div className="min-h-screen bg-[#0d0d1a]">
      <Navbar lang={lang} />
      <main className="pt-20 pb-12 px-4 max-w-7xl mx-auto">
        <div className="mt-8 mb-8">
          <h1 className="text-3xl font-black text-white mb-1">
            {lang === "tr" ? "AI İçgörüleri" : "AI Insights"}
          </h1>
          <p className="text-white/50">
            {lang === "tr" ? "Müzik zevkinin derinlemesine analizi" : "Deep analysis of your music taste"}
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            {topGenres.length > 0 && (
              <PersonalityCard topGenres={topGenres} listeningByHour={listeningByHour} lang={lang} />
            )}
            <InsightsPanel lang={lang} />
          </div>
          <div className="space-y-6">
            <ExplorerScoreCard
              discoveryScore={62}
              diversityScore={75}
              explorerScore={68}
              lang={lang}
            />
            <Badges lang={lang} />
          </div>
        </div>
      </main>
    </div>
  );
}
