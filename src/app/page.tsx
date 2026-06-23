"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Music2, BarChart3, Sparkles, Users, TrendingUp, Gift, ArrowRight } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

const features = [
  { icon: BarChart3,  title: "Derin Analizler",       desc: "Son 4 hafta, 6 ay ve tüm zamanlardaki dinleme istatistiklerini tek ekranda gör.", color: "#3B82F6" },
  { icon: Gift,       title: "Wrapped Her An",         desc: "Haftalık, aylık ve dönemsel Wrapped raporları otomatik olarak sana hazır.", color: "#A855F7" },
  { icon: Sparkles,   title: "Müzik Keşfi",            desc: "Yapay zeka destekli, dinleme geçmişine göre kişiselleştirilmiş öneriler.", color: "#F59E0B" },
  { icon: Users,      title: "Sosyal Karşılaştırma",   desc: "Arkadaşlarınla müzik uyumluluk skoru hesapla ve en iyi eşleşmeleri keşfet.", color: "#EC4899" },
  { icon: TrendingUp, title: "Kaşif Skoru",            desc: "Ne kadar çeşitli dinlediğini ölç, özel rozetler ve unvanlar kazan.", color: "#F97316" },
  { icon: Music2,     title: "Müzik Kişiliği",         desc: "AI müzik tadını analiz eder ve seni en iyi tanımlayan kişilik tipini bulur.", color: "#1DB954" },
];

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) router.push("/dashboard");
  }, [session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] overflow-hidden">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-[#1DB954]/6 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-purple-600/5 blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between max-w-6xl mx-auto px-6 py-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#1DB954] flex items-center justify-center">
            <Music2 className="w-4 h-4 text-black" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-white text-[15px]">On Repeat</span>
        </div>
        <button
          onClick={() => signIn("spotify")}
          className="flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
        >
          Giriş Yap
          <ArrowRight className="w-4 h-4" />
        </button>
      </nav>

      {/* Hero */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-8 text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#1DB954] bg-[#1DB954]/10 border border-[#1DB954]/20 px-3 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] pulse-green" />
            Spotify Analiz Platformu
          </div>

          {/* Heading */}
          <h1 className="text-[clamp(2.5rem,8vw,5.5rem)] font-black leading-[1.05] tracking-tight text-white mb-5">
            Müziğini gerçekten<br />
            <span className="text-[#1DB954]">tanı.</span>
          </h1>

          <p className="text-[clamp(1rem,2vw,1.2rem)] text-white/45 max-w-lg mx-auto leading-relaxed mb-10">
            Spotify Wrapped'i yılda bir değil, her gün yaşa. Dinleme alışkanlıklarını keşfet, yeni müzikler bul, arkadaşlarınla karşılaştır.
          </p>

          {/* CTA */}
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: "0 20px 60px rgba(29,185,84,0.35)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => signIn("spotify")}
            className="inline-flex items-center gap-3 bg-[#1DB954] text-black font-bold text-base px-8 py-4 rounded-2xl transition-all shadow-[0_8px_40px_rgba(29,185,84,0.25)]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            Spotify ile Devam Et
          </motion.button>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-20 text-left"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.07 }}
              className="group bg-[#111118] border border-white/[0.06] rounded-2xl p-5 hover:border-white/[0.12] hover:bg-[#18181f] transition-all duration-200"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${f.color}18` }}
              >
                <f.icon className="w-4.5 h-4.5" style={{ color: f.color }} />
              </div>
              <h3 className="text-white font-semibold text-sm mb-1.5">{f.title}</h3>
              <p className="text-white/40 text-xs leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center py-8 mt-8 text-white/20 text-xs border-t border-white/[0.04]">
        On Repeat — Spotify Analiz Platformu
      </div>
    </div>
  );
}
