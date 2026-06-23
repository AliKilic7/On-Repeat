"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Music, BarChart3, Users, Sparkles, TrendingUp, Gift, ChevronRight } from "lucide-react";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) router.push("/dashboard");
  }, [session, router]);

  const features = [
    { icon: BarChart3, title: "Derin Analizler", desc: "Son 4 hafta, 6 ay ve tüm zamanlardaki dinleme verilerini keşfet", color: "from-blue-500/20 to-blue-600/5", iconColor: "text-blue-400" },
    { icon: Gift, title: "Wrapped Her An", desc: "Haftalık, aylık ve dönemsel raporlar otomatik oluşsun", color: "from-purple-500/20 to-purple-600/5", iconColor: "text-purple-400" },
    { icon: Sparkles, title: "Müzik Keşfi", desc: "Yapay zeka destekli kişiselleştirilmiş öneri motoru", color: "from-yellow-500/20 to-yellow-600/5", iconColor: "text-yellow-400" },
    { icon: Users, title: "Sosyal Özellikler", desc: "Arkadaşlarınla müzik uyumluluk skoru karşılaştır", color: "from-pink-500/20 to-pink-600/5", iconColor: "text-pink-400" },
    { icon: TrendingUp, title: "Kaşif Skoru", desc: "Çeşitlilik puanını ölç ve özel rozetler kazan", color: "from-orange-500/20 to-orange-600/5", iconColor: "text-orange-400" },
    { icon: Music, title: "AI Müzik Asistanı", desc: "Müzik kişiliğini analiz eden yapay zeka içgörüleri", color: "from-green-500/20 to-green-600/5", iconColor: "text-[#1DB954]" },
  ];

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0d1a]">
        <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-[#1DB954] animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0d0d1a] relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-60 -right-60 w-[600px] h-[600px] rounded-full bg-[#1DB954]/8 blur-[120px]" />
        <div className="absolute -bottom-60 -left-60 w-[600px] h-[600px] rounded-full bg-purple-600/8 blur-[120px]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-blue-600/5 blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#1DB954] flex items-center justify-center shadow-lg shadow-[#1DB954]/30">
            <Music className="w-4 h-4 text-black" />
          </div>
          <span className="font-bold text-white text-lg">On Repeat</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => signIn("spotify")}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all border border-white/10"
        >
          Giriş Yap
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </nav>

      {/* Hero */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-[#1DB954]/10 border border-[#1DB954]/20 text-[#1DB954] text-sm font-medium px-4 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] animate-pulse" />
            Spotify Analiz Platformu
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tighter leading-none">
            Müziğini{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1DB954] to-emerald-300">
              Keşfet
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/50 mb-12 max-w-xl mx-auto leading-relaxed">
            Spotify Wrapped'i yılda bir kez değil, her an yaşa. Dinleme alışkanlıklarını analiz et, yeni müzikler bul.
          </p>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => signIn("spotify")}
            className="inline-flex items-center gap-3 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold text-base px-8 py-4 rounded-full transition-all shadow-2xl shadow-[#1DB954]/25"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            Spotify ile Giriş Yap
          </motion.button>
        </motion.div>

        {/* Features grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-24"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              className={`relative rounded-2xl p-6 text-left border border-white/5 bg-gradient-to-br ${f.color} backdrop-blur-sm hover:border-white/10 transition-all group`}
            >
              <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <f.icon className={`w-5 h-5 ${f.iconColor}`} />
              </div>
              <h3 className="text-white font-bold text-base mb-1.5">{f.title}</h3>
              <p className="text-white/45 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center pb-8 text-white/20 text-sm">
        On Repeat — Spotify Analiz Platformu
      </div>
    </main>
  );
}
