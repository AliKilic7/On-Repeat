"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Share2, Download } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Spinner } from "@/components/ui/spinner";
import { SpotifyTrack, SpotifyArtist } from "@/types";

type WrappedPeriod = "weekly" | "monthly" | "3monthly" | "6monthly";

interface WrappedData {
  topTracks: SpotifyTrack[];
  topArtists: SpotifyArtist[];
  topGenres: string[];
  totalListeningTimeMs: number;
  tracksCount: number;
  shareCode: string;
  period: string;
}

const periods: { value: WrappedPeriod; labelTr: string; labelEn: string }[] = [
  { value: "weekly", labelTr: "Bu Hafta", labelEn: "This Week" },
  { value: "monthly", labelTr: "Bu Ay", labelEn: "This Month" },
  { value: "3monthly", labelTr: "3 Aylık", labelEn: "3 Months" },
  { value: "6monthly", labelTr: "6 Aylık", labelEn: "6 Months" },
];

export default function WrappedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<WrappedData | null>(null);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState<WrappedPeriod>("weekly");
  const [slide, setSlide] = useState(0);
  const [lang] = useState<"tr" | "en">("tr");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  const generateWrapped = async () => {
    setLoading(true);
    const res = await fetch(`/api/wrapped?period=${period}`);
    const d = await res.json();
    setData(d);
    setLoading(false);
    setSlide(0);
  };

  const totalMinutes = data ? Math.round(data.totalListeningTimeMs / 60000) : 0;

  const slides = data
    ? [
        {
          bg: "from-[#1DB954]/20 to-[#0d0d1a]",
          content: (
            <div className="text-center">
              <p className="text-[#1DB954] font-semibold mb-4 text-lg">{lang === "tr" ? "Senin" : "Your"}</p>
              <h2 className="text-7xl font-black text-white mb-4">Wrapped</h2>
              <p className="text-white/60 text-xl">{periods.find(p => p.value === period)?.[lang === "tr" ? "labelTr" : "labelEn"]}</p>
            </div>
          ),
        },
        {
          bg: "from-purple-900/40 to-[#0d0d1a]",
          content: (
            <div className="text-center">
              <p className="text-purple-400 font-semibold mb-6">{lang === "tr" ? "Toplam Dinleme" : "Total Listening"}</p>
              <div className="text-8xl font-black text-white mb-2">{totalMinutes}</div>
              <p className="text-white/60 text-2xl">{lang === "tr" ? "dakika" : "minutes"}</p>
              <p className="text-white/40 mt-6">{lang === "tr" ? `${data.tracksCount} parça dinledin` : `You listened to ${data.tracksCount} tracks`}</p>
            </div>
          ),
        },
        {
          bg: "from-blue-900/40 to-[#0d0d1a]",
          content: (
            <div className="text-center w-full">
              <p className="text-blue-400 font-semibold mb-6">{lang === "tr" ? "En Sevdiğin Sanatçı" : "Top Artist"}</p>
              {data.topArtists[0] && (
                <>
                  {data.topArtists[0].images[0] && (
                    <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden ring-4 ring-blue-400/40 mb-6">
                      <Image src={data.topArtists[0].images[0].url} alt={data.topArtists[0].name} fill className="object-cover" />
                    </div>
                  )}
                  <h2 className="text-4xl font-black text-white">{data.topArtists[0].name}</h2>
                </>
              )}
            </div>
          ),
        },
        {
          bg: "from-rose-900/40 to-[#0d0d1a]",
          content: (
            <div className="text-center w-full">
              <p className="text-rose-400 font-semibold mb-6">{lang === "tr" ? "En Sevdiğin Şarkı" : "Top Track"}</p>
              {data.topTracks[0] && (
                <>
                  {data.topTracks[0].album.images[0] && (
                    <div className="relative w-40 h-40 mx-auto rounded-2xl overflow-hidden shadow-2xl mb-6">
                      <Image src={data.topTracks[0].album.images[0].url} alt={data.topTracks[0].name} fill className="object-cover" />
                    </div>
                  )}
                  <h2 className="text-3xl font-black text-white mb-2">{data.topTracks[0].name}</h2>
                  <p className="text-white/60">{data.topTracks[0].artists[0]?.name}</p>
                </>
              )}
            </div>
          ),
        },
        {
          bg: "from-amber-900/40 to-[#0d0d1a]",
          content: (
            <div className="text-center">
              <p className="text-amber-400 font-semibold mb-6">{lang === "tr" ? "En Sevdiğin Türler" : "Top Genres"}</p>
              <div className="flex flex-wrap justify-center gap-3">
                {data.topGenres.map((g, i) => (
                  <span
                    key={g}
                    className="px-6 py-3 rounded-full font-bold text-white"
                    style={{
                      fontSize: `${1.4 - i * 0.15}rem`,
                      background: `rgba(245, 158, 11, ${0.3 - i * 0.04})`,
                      border: "1px solid rgba(245,158,11,0.3)",
                    }}
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          ),
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-[#0d0d1a]">
      <Navbar lang={lang} />
      <main className="pt-20 pb-12 px-4 max-w-2xl mx-auto">
        <div className="mt-8 mb-8">
          <h1 className="text-3xl font-black text-white mb-1">Wrapped</h1>
          <p className="text-white/50">{lang === "tr" ? "Dönemsel müzik özetlerin" : "Your periodic music summary"}</p>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                period === p.value ? "bg-[#1DB954] text-black" : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              {lang === "tr" ? p.labelTr : p.labelEn}
            </button>
          ))}
        </div>

        <button
          onClick={generateWrapped}
          disabled={loading}
          className="w-full py-4 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold rounded-2xl transition-all mb-8 disabled:opacity-50"
        >
          {loading ? <Spinner className="w-5 h-5 mx-auto" /> : (lang === "tr" ? "Wrapped Oluştur" : "Generate Wrapped")}
        </button>

        {data && slides.length > 0 && (
          <div>
            <div className={`relative h-[500px] rounded-3xl bg-gradient-to-b ${slides[slide].bg} border border-white/10 flex items-center justify-center p-8 overflow-hidden`}>
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white/5 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-white/5 blur-3xl" />
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10 w-full"
                >
                  {slides[slide].content}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() => setSlide(Math.max(0, slide - 1))}
                disabled={slide === 0}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSlide(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === slide ? "bg-[#1DB954] w-6" : "bg-white/30"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => setSlide(Math.min(slides.length - 1, slide + 1))}
                disabled={slide === slides.length - 1}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {data.shareCode && (
              <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-white/50 text-sm">{lang === "tr" ? "Paylaşım Kodu" : "Share Code"}</p>
                  <p className="text-white font-mono font-bold text-lg">{data.shareCode}</p>
                </div>
                <button className="p-3 rounded-xl bg-[#1DB954]/20 text-[#1DB954] hover:bg-[#1DB954]/30 transition-all">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
