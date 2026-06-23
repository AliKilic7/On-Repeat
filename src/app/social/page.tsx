"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Users, UserPlus, Music, ExternalLink } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Spinner } from "@/components/ui/spinner";

interface FriendUser {
  id: string;
  name: string | null;
  image: string | null;
  spotifyId: string | null;
}

export default function SocialPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [friends, setFriends] = useState<FriendUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/friends")
      .then((r) => r.json())
      .then((d) => { setFriends(d.friends ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [status]);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16">
        <div className="mt-8 mb-7">
          <h1 className="text-2xl font-bold text-white mb-1">Sosyal</h1>
          <p className="text-sm text-white/35">Arkadaşlarınla müzik deneyimini karşılaştır</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: Users, value: friends.length, label: "Arkadaş",       color: "#1DB954" },
            { icon: Music, value: "—",            label: "Ortak Parça",   color: "#A855F7" },
            { icon: ExternalLink, value: "—",     label: "Uyumluluk",     color: "#F59E0B" },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-[#111118] border border-white/[0.06] rounded-2xl p-4"
            >
              <div className="w-8 h-8 rounded-xl mb-3 flex items-center justify-center" style={{ background: `${s.color}15` }}>
                <s.icon className="w-4 h-4" style={{ color: s.color }} />
              </div>
              <p className="text-xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-white/30 mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32"><Spinner className="w-8 h-8" /></div>
        ) : friends.length === 0 ? (
          <div className="bg-[#111118] border border-white/[0.06] rounded-2xl p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-white/15" />
            </div>
            <p className="text-white/50 font-semibold mb-1">Henüz arkadaşın yok</p>
            <p className="text-white/25 text-sm">Arkadaşlarını davet et ve müzik uyumluluğunu keşfet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {friends.map((friend, i) => (
              <motion.div
                key={friend.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="bg-[#111118] border border-white/[0.06] rounded-2xl p-4 flex items-center gap-3 hover:border-white/[0.1] transition-colors"
              >
                {friend.image ? (
                  <Image src={friend.image} alt={friend.name ?? ""} width={44} height={44} className="rounded-full ring-1 ring-white/10" />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-white/[0.05] flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-white/20" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">{friend.name ?? "Bilinmiyor"}</p>
                  <p className="text-white/30 text-xs truncate">@{friend.spotifyId ?? "—"}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
