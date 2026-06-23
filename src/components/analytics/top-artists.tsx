"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, Music } from "lucide-react";
import { SpotifyArtist } from "@/types";
import { getColorForGenre } from "@/lib/utils";

export function TopArtists({ artists, rangeLabel }: { artists: SpotifyArtist[]; rangeLabel?: string }) {
  return (
    <div className="bg-[#111118] border border-white/[0.06] rounded-2xl p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-white">En Çok Dinlenen Sanatçılar</h2>
          {rangeLabel && <p className="text-[11px] text-white/30 mt-0.5">{rangeLabel}</p>}
        </div>
        <span className="text-xs text-white/25">{artists.length} sanatçı</span>
      </div>
      <div className="space-y-0.5 overflow-y-auto max-h-[520px] pr-1 scrollbar-thin">
        {artists.map((artist, i) => (
          <motion.a
            key={artist.id}
            href={artist.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.05] group transition-colors cursor-pointer"
          >
            <span className="text-white/20 text-[11px] font-mono w-4 text-right flex-shrink-0 tabular-nums">{i + 1}</span>
            <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-white/[0.04] ring-1 ring-white/[0.06]">
              {artist.images[0] ? (
                <Image src={artist.images[0].url} alt={artist.name} fill sizes="36px" className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Music className="w-3.5 h-3.5 text-white/15" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate group-hover:text-[#1DB954] transition-colors">{artist.name}</p>
              <div className="flex gap-1 mt-0.5">
                {(artist.genres ?? []).slice(0, 2).map((g) => (
                  <span key={g} className="text-[10px] px-1.5 py-0.5 rounded-md font-medium" style={{ background: `${getColorForGenre(g)}18`, color: getColorForGenre(g) }}>
                    {g}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                <div className="h-full rounded-full bg-[#1DB954]/60" style={{ width: `${artist.popularity}%` }} />
              </div>
              <ExternalLink className="w-3 h-3 text-white/15 group-hover:text-white/40 transition-colors" />
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
