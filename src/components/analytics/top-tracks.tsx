"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, Music } from "lucide-react";
import { SpotifyTrack } from "@/types";
import { Card } from "@/components/ui/card";

interface TopTracksProps {
  tracks: SpotifyTrack[];
  lang?: "tr" | "en";
}

export function TopTracks({ tracks, lang = "tr" }: TopTracksProps) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-white">
          {lang === "tr" ? "En Çok Dinlenenler" : "Top Tracks"}
        </h2>
        <span className="text-xs text-white/30 font-medium">{tracks.length} parça</span>
      </div>
      <div className="space-y-1">
        {tracks.slice(0, 10).map((track, i) => (
          <motion.a
            key={track.id}
            href={track.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group cursor-pointer"
          >
            <span className="text-white/20 text-xs font-mono w-5 text-right flex-shrink-0">
              {i + 1}
            </span>
            <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
              {track.album.images[0] ? (
                <Image
                  src={track.album.images[0].url}
                  alt={track.album.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Music className="w-4 h-4 text-white/20" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate group-hover:text-[#1DB954] transition-colors">{track.name}</p>
              <p className="text-white/40 text-xs truncate mt-0.5">
                {track.artists.map((a) => a.name).join(", ")}
              </p>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 transition-colors flex-shrink-0" />
          </motion.a>
        ))}
      </div>
    </Card>
  );
}
