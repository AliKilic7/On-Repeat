"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, Music } from "lucide-react";
import { SpotifyArtist } from "@/types";
import { Card } from "@/components/ui/card";
import { getColorForGenre } from "@/lib/utils";

interface TopArtistsProps {
  artists: SpotifyArtist[];
  lang?: "tr" | "en";
}

export function TopArtists({ artists, lang = "tr" }: TopArtistsProps) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-white">
          {lang === "tr" ? "En Çok Dinlenen Sanatçılar" : "Top Artists"}
        </h2>
        <span className="text-xs text-white/30 font-medium">{artists.length} sanatçı</span>
      </div>
      <div className="space-y-2">
        {artists.slice(0, 8).map((artist, i) => (
          <motion.a
            key={artist.id}
            href={artist.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group cursor-pointer"
          >
            <span className="text-white/20 text-xs font-mono w-5 text-right flex-shrink-0">{i + 1}</span>
            <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-white/10">
              {artist.images[0] ? (
                <Image src={artist.images[0].url} alt={artist.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-white/5 flex items-center justify-center">
                  <Music className="w-4 h-4 text-white/20" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate group-hover:text-[#1DB954] transition-colors">{artist.name}</p>
              <div className="flex gap-1 mt-0.5 flex-wrap">
                {(artist.genres ?? []).slice(0, 2).map((g) => (
                  <span
                    key={g}
                    className="text-[10px] font-medium px-1.5 py-0.5 rounded-md"
                    style={{ backgroundColor: `${getColorForGenre(g)}20`, color: getColorForGenre(g) }}
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <div className="w-8 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#1DB954]"
                  style={{ width: `${artist.popularity}%` }}
                />
              </div>
              <ExternalLink className="w-3 h-3 text-white/20 group-hover:text-white/40 transition-colors ml-1" />
            </div>
          </motion.a>
        ))}
      </div>
    </Card>
  );
}
