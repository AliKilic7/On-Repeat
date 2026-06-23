"use client";

import { Card } from "@/components/ui/card";

interface ListeningHeatmapProps {
  listeningByHour: Record<number, number>;
  lang?: "tr" | "en";
}

export function ListeningHeatmap({ listeningByHour, lang = "tr" }: ListeningHeatmapProps) {
  const maxVal = Math.max(...Object.values(listeningByHour), 1);

  return (
    <Card>
      <h2 className="text-xl font-bold text-white mb-6">
        {lang === "tr" ? "Saatlik Dinleme Dağılımı" : "Hourly Listening Pattern"}
      </h2>
      <div className="grid grid-cols-12 gap-1">
        {Array.from({ length: 24 }, (_, h) => {
          const count = listeningByHour[h] ?? 0;
          const intensity = count / maxVal;
          return (
            <div key={h} className="flex flex-col items-center gap-1">
              <div
                className="w-full aspect-square rounded-sm transition-all"
                style={{
                  backgroundColor: `rgba(29, 185, 84, ${Math.max(intensity * 0.9, count > 0 ? 0.1 : 0)})`,
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
                title={`${h}:00 - ${count} ${lang === "tr" ? "parça" : "tracks"}`}
              />
              {h % 6 === 0 && (
                <span className="text-xs text-white/30">{h}h</span>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between mt-4 text-xs text-white/40">
        <span>{lang === "tr" ? "Az" : "Less"}</span>
        <div className="flex gap-1">
          {[0.1, 0.3, 0.5, 0.7, 0.9].map((v) => (
            <div
              key={v}
              className="w-4 h-4 rounded-sm"
              style={{ backgroundColor: `rgba(29, 185, 84, ${v})` }}
            />
          ))}
        </div>
        <span>{lang === "tr" ? "Çok" : "More"}</span>
      </div>
    </Card>
  );
}
