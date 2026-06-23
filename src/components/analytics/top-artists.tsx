"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, Music } from "lucide-react";
import { SpotifyArtist } from "@/types";
import { Card } from "@/components/ui/card";
import { BadgePill } from "@/components/ui/badge-pill";
import { getColorForGenre } from "@/lib/utils";

interface TopArtistsProps {
  artists: SpotifyArtist[];
  lang?: "tr" | "en";
}

export function TopArtists({ artists, lang = "tr" }: TopArtistsProps) {
  return (
    <Card>
      <h2 className="text-xl font-bold text-white mb-6">
        {lang === "tr" ? "En Çok Dinlenen Sanatçılar" : "Top Artists"}
      </h2>
      <div className="space-y-4">
        {artists.slice(0, 8).map((artist, i) => (
          <motion.div
            key={artist.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-center gap-4 group"
          >
            <span className="text-white/30 text-sm font-mono w-6 text-center flex-shrink-0">
              {i + 1}
            </span>
            <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white/10">
              {artist.images[0] ? (
                <Image
                  src={artist.images[0].url}
                  alt={artist.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-white/10 flex items-center justify-center">
                  <Music className="w-6 h-6 text-white/30" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-white font-semibold text-sm truncate">{artist.name}</p>
                <a
                  href={artist.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-white/40 hover:text-white"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {artist.genres.slice(0, 2).map((g) => (
                  <BadgePill key={g} label={g} color={getColorForGenre(g)} />
                ))}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xs text-white/40">{lang === "tr" ? "Popülerlik" : "Popularity"}</div>
              <div className="text-sm font-bold text-[#1DB954]">{artist.popularity}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
