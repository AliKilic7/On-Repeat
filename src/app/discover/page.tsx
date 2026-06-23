"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Heart, BookmarkPlus, X, Play, ExternalLink } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Spinner } from "@/components/ui/spinner";
import { Card } from "@/components/ui/card";
import toast from "react-hot-toast";

interface RecommendationItem {
  trackId: string;
  trackName: string;
  artistName: string;
  albumName: string;
  imageUrl: string | null;
  previewUrl: string | null;
  category: string;
  reason: string;
  score: number;
}

const categoryLabels: Record<string, { tr: string; en: string }> = {
  this_week_discover: { tr: "Bu Hafta Keşfet", en: "Discover This Week" },
  new_releases_for_you: { tr: "Sana Özel Yeni Çıkanlar", en: "New Releases For You" },
  similar_to_recent: { tr: "Son Dinlediklerine Benzer", en: "Similar To Recent" },
  hidden_gems: { tr: "Gizli Cevherler", en: "Hidden Gems" },
  rising_artists: { tr: "Yükselen Sanatçılar", en: "Rising Artists" },
};

export default function DiscoverPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [recs, setRecs] = useState<RecommendationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang] = useState<"tr" | "en">("tr");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  useEffect(() => {
    if (!session) return;
    fetch("/api/recommendations")
      .then((r) => r.json())
      .then((d) => { setRecs(d.recommendations ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [session]);

  const handleFeedback = async (trackId: string, feedback: string) => {
    await fetch("/api/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackId, feedback }),
    });
    setRecs((prev) => prev.filter((r) => r.trackId !== trackId));
    if (feedback === "like") toast.success(lang === "tr" ? "Beğenildi!" : "Liked!");
    else if (feedback === "save") toast.success(lang === "tr" ? "Kaydedildi!" : "Saved!");
    else toast(lang === "tr" ? "Atlandı" : "Skipped");
  };

  const groupedByCategory = recs.reduce<Record<string, RecommendationItem[]>>((acc, r) => {
    if (!acc[r.category]) acc[r.category] = [];
    acc[r.category].push(r);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#0d0d1a]">
      <Navbar lang={lang} />
      <main className="pt-20 pb-12 px-4 max-w-7xl mx-auto">
        <div className="mt-8 mb-8">
          <h1 className="text-3xl font-black text-white mb-1">
            {lang === "tr" ? "Müzik Keşfi" : "Music Discovery"}
          </h1>
          <p className="text-white/50">
            {lang === "tr" ? "Dinleme geçmişine göre kişiselleştirilmiş öneriler" : "Personalized recommendations based on your history"}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Spinner className="w-12 h-12" />
          </div>
        ) : Object.keys(groupedByCategory).length === 0 ? (
          <div className="text-center py-32 text-white/40">
            {lang === "tr" ? "Öneri bulunamadı." : "No recommendations found."}
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(groupedByCategory).map(([category, items]) => (
              <div key={category}>
                <h2 className="text-xl font-bold text-white mb-4">
                  {categoryLabels[category]?.[lang] ?? category}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {items.map((rec, i) => (
                    <motion.div
                      key={rec.trackId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="glass rounded-2xl overflow-hidden group"
                    >
                      <div className="relative aspect-square">
                        {rec.imageUrl ? (
                          <Image src={rec.imageUrl} alt={rec.trackName} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-white/10" />
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          {rec.previewUrl && (
                            <button className="p-3 rounded-full bg-[#1DB954] text-black hover:scale-110 transition-transform">
                              <Play className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-white font-semibold text-sm truncate">{rec.trackName}</p>
                        <p className="text-white/50 text-xs truncate mb-2">{rec.artistName}</p>
                        <p className="text-white/30 text-xs mb-4 line-clamp-2">{rec.reason}</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleFeedback(rec.trackId, "like")}
                            className="flex-1 py-2 rounded-lg bg-[#1DB954]/20 text-[#1DB954] hover:bg-[#1DB954]/30 transition-all flex items-center justify-center"
                          >
                            <Heart className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleFeedback(rec.trackId, "save")}
                            className="flex-1 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all flex items-center justify-center"
                          >
                            <BookmarkPlus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleFeedback(rec.trackId, "skip")}
                            className="flex-1 py-2 rounded-lg bg-white/10 text-white/50 hover:bg-white/20 transition-all flex items-center justify-center"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
