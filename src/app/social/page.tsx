"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Users, UserPlus, Music, X, Search } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Spinner } from "@/components/ui/spinner";
import toast from "react-hot-toast";

interface FriendUser {
  id: string;
  name: string | null;
  image: string | null;
  spotifyId: string | null;
}

export default function SocialPage() {
  const { status } = useSession();
  const router = useRouter();
  const [friends, setFriends] = useState<FriendUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState<FriendUser | null>(null);
  const [searching, setSearching] = useState(false);
  const [adding, setAdding] = useState(false);

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

  const searchUser = async () => {
    if (!searchId.trim()) return;
    setSearching(true);
    setSearchResult(null);
    try {
      const res = await fetch(`/api/users/search?spotifyId=${encodeURIComponent(searchId.trim())}`);
      const data = await res.json();
      if (data.user) setSearchResult(data.user);
      else toast.error("Kullanıcı bulunamadı");
    } catch {
      toast.error("Arama başarısız");
    }
    setSearching(false);
  };

  const sendRequest = async (receiverId: string) => {
    setAdding(true);
    try {
      const res = await fetch("/api/friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId }),
      });
      const data = await res.json();
      if (data.error) {
        toast.error(data.error === "Already exists" ? "Zaten arkadaşsınız" : data.error);
      } else {
        toast.success("Arkadaşlık isteği gönderildi!");
        setShowAdd(false);
        setSearchId("");
        setSearchResult(null);
      }
    } catch {
      toast.error("İstek gönderilemedi");
    }
    setAdding(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16">
        <div className="mt-8 mb-7 flex items-end justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Sosyal</h1>
            <p className="text-sm text-white/35">Arkadaşlarınla müzik deneyimini karşılaştır</p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold rounded-xl text-sm transition-all"
          >
            <UserPlus className="w-4 h-4" />
            Arkadaş Ekle
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: Users, value: friends.length, label: "Arkadaş", color: "#1DB954" },
            { icon: Music, value: "—", label: "Ortak Parça", color: "#A855F7" },
            { icon: Users, value: "—", label: "Uyumluluk", color: "#F59E0B" },
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
            <p className="text-white/25 text-sm mb-5">Arkadaşlarını davet et ve müzik uyumluluğunu keşfet</p>
            <button
              onClick={() => setShowAdd(true)}
              className="px-5 py-2.5 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold rounded-xl text-sm transition-all"
            >
              İlk Arkadaşını Ekle
            </button>
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
                  <Image src={friend.image} alt={friend.name ?? ""} width={44} height={44} className="rounded-full ring-1 ring-white/10 flex-shrink-0" />
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

      {/* Add Friend Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowAdd(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#111118] border border-white/[0.08] rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-white font-semibold">Arkadaş Ekle</h2>
                <button onClick={() => { setShowAdd(false); setSearchResult(null); setSearchId(""); }} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/40 hover:text-white transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-white/40 text-xs mb-4">Arkadaşının Spotify kullanıcı adını gir (profil URL'sindeki ID).</p>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && searchUser()}
                  placeholder="spotify:user:abc123 veya abc123"
                  className="flex-1 bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#1DB954]/50"
                />
                <button
                  onClick={searchUser}
                  disabled={searching || !searchId.trim()}
                  className="px-4 py-2.5 bg-[#1DB954]/10 text-[#1DB954] rounded-xl hover:bg-[#1DB954]/20 disabled:opacity-40 transition-all"
                >
                  {searching ? <Spinner className="w-4 h-4" /> : <Search className="w-4 h-4" />}
                </button>
              </div>

              <AnimatePresence>
                {searchResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 p-4 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center gap-3"
                  >
                    {searchResult.image ? (
                      <Image src={searchResult.image} alt={searchResult.name ?? ""} width={40} height={40} className="rounded-full flex-shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-white/[0.08] flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 text-white/20" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{searchResult.name ?? "Bilinmiyor"}</p>
                      <p className="text-white/30 text-xs">@{searchResult.spotifyId}</p>
                    </div>
                    <button
                      onClick={() => sendRequest(searchResult!.id)}
                      disabled={adding}
                      className="px-4 py-1.5 bg-[#1DB954] hover:bg-[#1ed760] text-black text-xs font-bold rounded-lg disabled:opacity-50 transition-all"
                    >
                      {adding ? "..." : "Ekle"}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
