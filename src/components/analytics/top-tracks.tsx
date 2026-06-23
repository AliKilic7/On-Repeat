"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, Music } from "lucide-react";
import { SpotifyTrack } from "@/types";

export function TopTracks({ tracks }: { tracks: SpotifyTrack[] }) {
  return (
    <div className="bg-[#111118] border border-white/[0.06] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-white">En Çok Dinlenenler</h2>
        <span className="text-xs text-white/25">{Math.min(tracks.length, 10)} parça</span>
      </div>
      <div className="space-y-0.5">
        {tracks.slice(0, 10).map((track, i) => (
          <motion.a
            key={track.id}
            href={track.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.035 }}
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.05] group transition-colors cursor-pointer"
          >
            <span className="text-white/20 text-[11px] font-mono w-4 text-right flex-shrink-0 tabular-nums">{i + 1}</span>
            <div className="relative w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-white/[0.04]">
              {track.album.images[0] ? (
                <Image src={track.album.images[0].url} alt={track.album.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Music className="w-3.5 h-3.5 text-white/15" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate group-hover:text-[#1DB954] transition-colors">{track.name}</p>
              <p className="text-white/35 text-[11px] truncate mt-0.5">{track.artists.map((a) => a.name).join(", ")}</p>
            </div>
            <ExternalLink className="w-3 h-3 text-white/15 group-hover:text-white/40 transition-colors flex-shrink-0" />
          </motion.a>
        ))}
      </div>
    </div>
  );
}
