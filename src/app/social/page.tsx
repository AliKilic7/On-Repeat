"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Users, UserPlus, Music, Star } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Card } from "@/components/ui/card";
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
  const [lang] = useState<"tr" | "en">("tr");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  useEffect(() => {
    if (!session) return;
    fetch("/api/friends")
      .then((r) => r.json())
      .then((d) => { setFriends(d.friends ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [session]);

  return (
    <div className="min-h-screen bg-[#0d0d1a]">
      <Navbar lang={lang} />
      <main className="pt-20 pb-12 px-4 max-w-7xl mx-auto">
        <div className="mt-8 mb-8">
          <h1 className="text-3xl font-black text-white mb-1">
            {lang === "tr" ? "Sosyal" : "Social"}
          </h1>
          <p className="text-white/50">
            {lang === "tr" ? "Arkadaşlarınla müzik deneyimini paylaş" : "Share your music experience with friends"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { icon: Users, value: friends.length.toString(), label: lang === "tr" ? "Arkadaş" : "Friends", color: "#1DB954" },
            { icon: Music, value: "—", label: lang === "tr" ? "Ortak Şarkı" : "Common Tracks", color: "#A855F7" },
            { icon: Star, value: "—", label: lang === "tr" ? "Uyumluluk" : "Compatibility", color: "#F59E0B" },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${s.color}22` }}>
                <s.icon className="w-6 h-6" style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-white/50 text-sm">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner className="w-10 h-10" />
          </div>
        ) : friends.length === 0 ? (
          <Card className="text-center py-16">
            <UserPlus className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/60 text-lg font-semibold mb-2">
              {lang === "tr" ? "Henüz arkadaşın yok" : "No friends yet"}
            </p>
            <p className="text-white/30 text-sm">
              {lang === "tr" ? "Arkadaşlarını davet et ve müzik uyumluluğunu keşfet!" : "Invite friends and discover your music compatibility!"}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {friends.map((friend, i) => (
              <motion.div
                key={friend.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 flex items-center gap-4"
              >
                {friend.image ? (
                  <Image src={friend.image} alt={friend.name ?? ""} width={56} height={56} className="rounded-full ring-2 ring-[#1DB954]/30" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-white/30" />
                  </div>
                )}
                <div>
                  <p className="text-white font-semibold">{friend.name ?? lang === "tr" ? "Bilinmiyor" : "Unknown"}</p>
                  <p className="text-white/40 text-sm">@{friend.spotifyId ?? "—"}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
