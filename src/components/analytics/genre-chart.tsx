"use client";

import { GenreCount } from "@/types";
import { getColorForGenre } from "@/lib/utils";

export function GenreChart({ genres }: { genres: GenreCount[] }) {
  const top = genres.slice(0, 8);
  const max = top[0]?.count ?? 1;

  return (
    <div className="bg-[#111118] border border-white/[0.06] rounded-2xl p-5">
      <h2 className="text-sm font-semibold text-white mb-5">Tür Dağılımı</h2>
      <div className="space-y-3">
        {top.map((g, i) => {
          const color = getColorForGenre(g.genre);
          const pct = Math.round((g.count / max) * 100);
          return (
            <div key={g.genre} className="group">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-white/70 font-medium capitalize truncate">{g.genre}</span>
                <span className="text-[11px] text-white/30 ml-2 flex-shrink-0">{g.percentage.toFixed(0)}%</span>
              </div>
              <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, backgroundColor: color, opacity: 0.7 + i * -0.05 }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
