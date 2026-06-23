"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Play, ExternalLink } from "lucide-react";
import { SpotifyTrack } from "@/types";
import { Card } from "@/components/ui/card";

interface TopTracksProps {
  tracks: SpotifyTrack[];
  lang?: "tr" | "en";
}

export function TopTracks({ tracks, lang = "tr" }: TopTracksProps) {
  return (
    <Card>
      <h2 className="text-xl font-bold text-white mb-6">
        {lang === "tr" ? "En Çok Dinlenenler" : "Top Tracks"}
      </h2>
      <div className="space-y-3">
        {tracks.slice(0, 10).map((track, i) => (
          <motion.div
            key={track.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group"
          >
            <span className="text-white/30 text-sm font-mono w-6 text-center">
              {i + 1}
            </span>
            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
              {track.album.images[0] && (
                <Image
                  src={track.album.images[0].url}
                  alt={track.album.name}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">{track.name}</p>
              <p className="text-white/50 text-xs truncate">
                {track.artists.map((a) => a.name).join(", ")}
              </p>
            </div>
            <a
              href={track.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-0 group-hover:opacity-100 transition-opacity text-white/50 hover:text-white"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
