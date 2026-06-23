"use client";

interface ListeningHeatmapProps {
  listeningByHour: Record<number, number>;
}

export function ListeningHeatmap({ listeningByHour }: ListeningHeatmapProps) {
  const maxVal = Math.max(...Object.values(listeningByHour), 1);
  const hours = Array.from({ length: 24 }, (_, h) => h);
  const periods = [
    { label: "Sabah", range: "06–12" },
    { label: "Öğle",  range: "12–18" },
    { label: "Akşam", range: "18–00" },
    { label: "Gece",  range: "00–06" },
  ];
  const periodSums = [
    hours.slice(6,12).reduce((a,h) => a + (listeningByHour[h]??0), 0),
    hours.slice(12,18).reduce((a,h) => a + (listeningByHour[h]??0), 0),
    hours.slice(18,24).reduce((a,h) => a + (listeningByHour[h]??0), 0),
    [...hours.slice(0,6)].reduce((a,h) => a + (listeningByHour[h]??0), 0),
  ];
  const maxPeriod = Math.max(...periodSums, 1);

  return (
    <div className="bg-[#111118] border border-white/[0.06] rounded-2xl p-5">
      <h2 className="text-sm font-semibold text-white mb-5">Saatlik Dinleme</h2>

      {/* Hour bars */}
      <div className="flex items-end gap-0.5 h-16 mb-3">
        {hours.map((h) => {
          const val = listeningByHour[h] ?? 0;
          const pct = val / maxVal;
          return (
            <div key={h} className="flex-1 flex flex-col items-center justify-end" title={`${h}:00 — ${val} parça`}>
              <div
                className="w-full rounded-sm transition-all"
                style={{
                  height: `${Math.max(pct * 100, val > 0 ? 8 : 2)}%`,
                  backgroundColor: `rgba(29,185,84,${Math.max(pct * 0.85, val > 0 ? 0.12 : 0.04)})`,
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-[10px] text-white/20 mb-5">
        <span>00</span><span>06</span><span>12</span><span>18</span><span>23</span>
      </div>

      {/* Period breakdown */}
      <div className="grid grid-cols-4 gap-2">
        {periods.map((p, i) => (
          <div key={p.label} className="text-center">
            <div className="h-1 bg-white/[0.04] rounded-full mb-2 overflow-hidden">
              <div className="h-full bg-[#1DB954]/50 rounded-full" style={{ width: `${(periodSums[i]/maxPeriod)*100}%` }} />
            </div>
            <p className="text-[10px] text-white/50 font-medium">{p.label}</p>
            <p className="text-[10px] text-white/20">{p.range}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
