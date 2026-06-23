"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Share2, Sparkles, Check } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Spinner } from "@/components/ui/spinner";
import { SpotifyTrack, SpotifyArtist } from "@/types";
import toast from "react-hot-toast";

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

const periods: { value: WrappedPeriod; label: string }[] = [
  { value: "weekly",   label: "Bu Hafta" },
  { value: "monthly",  label: "Bu Ay" },
  { value: "3monthly", label: "3 Aylık" },
  { value: "6monthly", label: "6 Aylık" },
];

export default function WrappedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<WrappedData | null>(null);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState<WrappedPeriod>("weekly");
  const [slide, setSlide] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  const generateWrapped = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/wrapped?period=${period}`);
      const d = await res.json();
      setData(d);
      setSlide(0);
    } catch {
      toast.error("Wrapped oluşturulamadı");
    }
    setLoading(false);
  };

  const copyCode = () => {
    if (!data?.shareCode) return;
    navigator.clipboard.writeText(data.shareCode);
    setCopied(true);
    toast.success("Kod kopyalandı");
    setTimeout(() => setCopied(false), 2000);
  };

  const totalMinutes = data ? Math.round(data.totalListeningTimeMs / 60000) : 0;

  const hasWrapped = !!data && Array.isArray(data.topTracks) && Array.isArray(data.topArtists) && Array.isArray(data.topGenres);
  const slides = hasWrapped ? [
    {
      accent: "#1DB954",
      content: (
        <div className="text-center">
          <p className="text-[#1DB954] font-semibold mb-3 uppercase tracking-widest text-sm">Senin</p>
          <h2 className="text-6xl sm:text-7xl font-black text-white mb-3">Wrapped</h2>
          <p className="text-white/40 text-lg">{periods.find(p => p.value === period)?.label}</p>
        </div>
      ),
    },
    {
      accent: "#A855F7",
      content: (
        <div className="text-center">
          <p className="text-purple-400 font-semibold mb-5 uppercase tracking-widest text-sm">Toplam Dinleme</p>
          <div className="text-7xl sm:text-8xl font-black text-white mb-1 tabular-nums">{totalMinutes.toLocaleString("tr")}</div>
          <p className="text-white/50 text-xl">dakika</p>
          <p className="text-white/30 text-sm mt-5">{data.tracksCount} parça dinledin</p>
        </div>
      ),
    },
    {
      accent: "#3B82F6",
      content: (
        <div className="text-center w-full">
          <p className="text-blue-400 font-semibold mb-6 uppercase tracking-widest text-sm">En Sevdiğin Sanatçı</p>
          {data.topArtists[0] ? (
            <>
              {data.topArtists[0].images[0] && (
                <div className="relative w-36 h-36 mx-auto rounded-full overflow-hidden ring-4 ring-blue-400/30 mb-5">
                  <Image src={data.topArtists[0].images[0].url} alt={data.topArtists[0].name} fill sizes="144px" className="object-cover" />
                </div>
              )}
              <h2 className="text-3xl sm:text-4xl font-black text-white">{data.topArtists[0].name}</h2>
            </>
          ) : <p className="text-white/30">Veri yok</p>}
        </div>
      ),
    },
    {
      accent: "#F43F5E",
      content: (
        <div className="text-center w-full">
          <p className="text-rose-400 font-semibold mb-6 uppercase tracking-widest text-sm">En Sevdiğin Şarkı</p>
          {data.topTracks[0] ? (
            <>
              {data.topTracks[0].album.images[0] && (
                <div className="relative w-36 h-36 mx-auto rounded-2xl overflow-hidden shadow-2xl mb-5">
                  <Image src={data.topTracks[0].album.images[0].url} alt={data.topTracks[0].name} fill sizes="144px" className="object-cover" />
                </div>
              )}
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-1.5">{data.topTracks[0].name}</h2>
              <p className="text-white/50">{data.topTracks[0].artists[0]?.name}</p>
            </>
          ) : <p className="text-white/30">Veri yok</p>}
        </div>
      ),
    },
    {
      accent: "#F59E0B",
      content: (
        <div className="text-center">
          <p className="text-amber-400 font-semibold mb-6 uppercase tracking-widest text-sm">En Sevdiğin Türler</p>
          <div className="flex flex-wrap justify-center gap-2.5 px-4">
            {data.topGenres.length > 0 ? data.topGenres.slice(0, 6).map((g, i) => (
              <span
                key={g}
                className="px-4 py-2 rounded-full font-bold text-white capitalize"
                style={{
                  fontSize: `${1.2 - i * 0.1}rem`,
                  background: `rgba(245,158,11,${0.22 - i * 0.025})`,
                  border: "1px solid rgba(245,158,11,0.25)",
                }}
              >
                {g}
              </span>
            )) : <p className="text-white/30">Tür verisi yok</p>}
          </div>
        </div>
      ),
    },
  ] : [];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      <main className="px-4 sm:px-6 lg:px-10 pt-20 pb-16">
        <div className="mt-8 mb-7">
          <h1 className="text-2xl font-bold text-white mb-1">Wrapped</h1>
          <p className="text-sm text-white/35">Dönemsel müzik özetlerin</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 items-start">
          {/* Left column — controls */}
          <div className="space-y-4">
            {/* Period selector */}
            <div className="bg-[#111118] border border-white/[0.06] rounded-2xl p-4">
              <p className="text-xs text-white/35 font-medium mb-2.5">Dönem seç</p>
              <div className="grid grid-cols-2 gap-1.5">
                {periods.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setPeriod(p.value)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      period === p.value ? "bg-[#1DB954] text-black" : "bg-white/[0.04] text-white/40 hover:text-white/70"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generateWrapped}
              disabled={loading}
              className="w-full py-3.5 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Spinner className="w-5 h-5" /> : <><Sparkles className="w-4 h-4" /> Wrapped Oluştur</>}
            </button>

            {/* Share code */}
            {data && data.shareCode && (
              <div className="p-4 rounded-2xl bg-[#111118] border border-white/[0.06] flex items-center justify-between">
                <div>
                  <p className="text-white/30 text-xs mb-0.5">Paylaşım Kodu</p>
                  <p className="text-white font-mono font-bold tracking-wider">{data.shareCode}</p>
                </div>
                <button
                  onClick={copyCode}
                  className="p-2.5 rounded-xl bg-[#1DB954]/10 text-[#1DB954] hover:bg-[#1DB954]/20 transition-all"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>

          {/* Right column — slide stage */}
          <div>
          {data && slides.length > 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Slide card */}
            <div className="relative h-[440px] rounded-3xl border border-white/[0.08] flex items-center justify-center p-8 overflow-hidden bg-[#111118]">
              <div
                className="absolute inset-0 opacity-40 transition-colors duration-500"
                style={{ background: `radial-gradient(circle at 50% 30%, ${slides[slide].accent}25, transparent 70%)` }}
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10 w-full"
                >
                  {slides[slide].content}
                </motion.div>
              </AnimatePresence>

              {/* Progress dots top */}
              <div className="absolute top-4 left-0 right-0 flex gap-1.5 px-6">
                {slides.map((_, i) => (
                  <div key={i} className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-300" style={{ width: i <= slide ? "100%" : "0%", backgroundColor: slides[slide].accent }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mt-5">
              <button
                onClick={() => setSlide(Math.max(0, slide - 1))}
                disabled={slide === 0}
                className="p-2.5 rounded-xl bg-[#111118] border border-white/[0.06] hover:bg-white/[0.06] disabled:opacity-25 transition-all"
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>
              <span className="text-xs text-white/30 font-medium">{slide + 1} / {slides.length}</span>
              <button
                onClick={() => setSlide(Math.min(slides.length - 1, slide + 1))}
                disabled={slide === slides.length - 1}
                className="p-2.5 rounded-xl bg-[#111118] border border-white/[0.06] hover:bg-white/[0.06] disabled:opacity-25 transition-all"
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </motion.div>
          ) : (
            !loading && (
              <div className="h-[440px] rounded-3xl border border-dashed border-white/[0.08] flex flex-col items-center justify-center text-white/20 text-sm bg-[#111118]/40">
                <Sparkles className="w-8 h-8 mb-3 text-white/15" />
                Dönem seç ve Wrapped&apos;ini oluştur
              </div>
            )
          )}
          </div>
        </div>
      </main>
    </div>
  );
}
