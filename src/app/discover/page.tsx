"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Heart, BookmarkPlus, X, Play, Music } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Spinner } from "@/components/ui/spinner";
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

const categoryLabels: Record<string, string> = {
  this_week_discover:    "Bu Hafta Keşfet",
  new_releases_for_you:  "Sana Özel Yeni Çıkanlar",
  similar_to_recent:     "Son Dinlediklerine Benzer",
  hidden_gems:           "Gizli Cevherler",
  rising_artists:        "Yükselen Sanatçılar",
};

export default function DiscoverPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [recs, setRecs] = useState<RecommendationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/recommendations")
      .then((r) => r.json())
      .then((d) => { setRecs(d.recommendations ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [status]);

  const handleFeedback = async (trackId: string, feedback: string) => {
    fetch("/api/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackId, feedback }),
    });
    setRecs((prev) => prev.filter((r) => r.trackId !== trackId));
    if (feedback === "like") toast.success("Beğenildi!");
    else if (feedback === "save") toast.success("Kaydedildi!");
    else toast("Atlandı", { icon: "→" });
  };

  const grouped = recs.reduce<Record<string, RecommendationItem[]>>((acc, r) => {
    (acc[r.category] ||= []).push(r);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      <main className="px-4 sm:px-6 lg:px-10 pt-20 pb-16">
        <div className="mt-8 mb-7">
          <h1 className="text-2xl font-bold text-white mb-1">Müzik Keşfi</h1>
          <p className="text-sm text-white/35">Dinleme geçmişine göre kişiselleştirilmiş öneriler</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-40"><Spinner className="w-8 h-8" /></div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 text-white/20">
            <Music className="w-10 h-10 mb-3" />
            <p className="text-sm">Henüz öneri bulunamadı.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">
                  {categoryLabels[category] ?? category}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  <AnimatePresence>
                    {items.map((rec, i) => (
                      <motion.div
                        key={rec.trackId}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: i * 0.04 }}
                        className="bg-[#111118] border border-white/[0.06] rounded-2xl overflow-hidden group hover:border-white/[0.1] transition-all"
                      >
                        <div className="relative aspect-square bg-white/[0.03]">
                          {rec.imageUrl ? (
                            <Image src={rec.imageUrl} alt={rec.trackName} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw" className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Music className="w-8 h-8 text-white/10" />
                            </div>
                          )}
                          {rec.previewUrl && (
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                onClick={() => {
                                  const audio = new Audio(rec.previewUrl!);
                                  audio.play();
                                }}
                                className="w-10 h-10 rounded-full bg-[#1DB954] flex items-center justify-center hover:scale-110 transition-transform"
                              >
                                <Play className="w-4 h-4 text-black fill-black" />
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <p className="text-white text-xs font-semibold truncate">{rec.trackName}</p>
                          <p className="text-white/35 text-[11px] truncate mt-0.5 mb-2">{rec.artistName}</p>
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleFeedback(rec.trackId, "like")}
                              className="flex-1 py-1.5 rounded-lg bg-[#1DB954]/10 text-[#1DB954] hover:bg-[#1DB954]/20 transition-all flex items-center justify-center"
                            >
                              <Heart className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleFeedback(rec.trackId, "save")}
                              className="flex-1 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all flex items-center justify-center"
                            >
                              <BookmarkPlus className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleFeedback(rec.trackId, "skip")}
                              className="flex-1 py-1.5 rounded-lg bg-white/[0.05] text-white/30 hover:bg-white/[0.08] transition-all flex items-center justify-center"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
