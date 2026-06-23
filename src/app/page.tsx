"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Music, BarChart3, Users, Sparkles, TrendingUp, Gift } from "lucide-react";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) router.push("/dashboard");
  }, [session, router]);

  const features = [
    { icon: BarChart3, title: "Derin Analizler", desc: "Son 7, 30, 90 ve 180 günlük dinleme verilerinizi keşfedin" },
    { icon: Gift, title: "Wrapped Her An", desc: "Haftalık, aylık ve dönemsel Wrapped raporları otomatik oluşsun" },
    { icon: Sparkles, title: "Müzik Keşfi", desc: "Yapay zeka destekli kişiselleştirilmiş öneri motoru" },
    { icon: Users, title: "Sosyal Özellikler", desc: "Arkadaşlarınla müzik uyumluluk skoru ve ortak playlist oluştur" },
    { icon: TrendingUp, title: "Kaşif Skoru", desc: "Ne kadar çeşitli müzik dinlediğini ölç ve rozet kazan" },
    { icon: Music, title: "AI Müzik Asistanı", desc: "Müzik zevkini yorumlayan ve öneriler sunan yapay zeka asistanı" },
  ];

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-white/20 border-t-[#1DB954] animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen animated-gradient relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#1DB954]/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#1DB954] flex items-center justify-center shadow-2xl shadow-[#1DB954]/30">
              <Music className="w-8 h-8 text-black" />
            </div>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter">
            Self<span className="text-[#1DB954]">Meat</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/60 mb-4 max-w-2xl mx-auto leading-relaxed">
            Müzik dinleme alışkanlıklarını keşfet, yeni müzikler bul ve arkadaşlarınla paylaş.
          </p>
          <p className="text-white/40 mb-12">
            Spotify Wrapped&apos;i yılda bir kez değil, her an yaşa.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => signIn("spotify")}
            className="inline-flex items-center gap-3 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold text-lg px-10 py-4 rounded-full transition-all shadow-2xl shadow-[#1DB954]/30"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            Spotify ile Giriş Yap
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="glass rounded-2xl p-6 hover:bg-white/10 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-[#1DB954]/20 flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-[#1DB954]" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
