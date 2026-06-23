"use client";

interface WeekdayChartProps {
  listeningByDayOfWeek: Record<string, number>;
  weekdayVsWeekend: { weekday: number; weekend: number };
}

const days = [
  { key: "Monday",    short: "Pzt" },
  { key: "Tuesday",   short: "Sal" },
  { key: "Wednesday", short: "Çar" },
  { key: "Thursday",  short: "Per" },
  { key: "Friday",    short: "Cum" },
  { key: "Saturday",  short: "Cmt", weekend: true },
  { key: "Sunday",    short: "Paz", weekend: true },
];

export function WeekdayChart({ listeningByDayOfWeek, weekdayVsWeekend }: WeekdayChartProps) {
  const values = days.map((d) => listeningByDayOfWeek[d.key] ?? 0);
  const max = Math.max(...values, 1);
  const total = weekdayVsWeekend.weekday + weekdayVsWeekend.weekend;
  const wdPct = total > 0 ? Math.round((weekdayVsWeekend.weekday / total) * 100) : 50;
  const wePct = 100 - wdPct;

  return (
    <div className="bg-[#111118] border border-white/[0.06] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold text-white">Günlük Dinleme</h2>
        <div className="flex items-center gap-3 text-[11px] text-white/35">
          <span><span className="text-[#1DB954]/70">●</span> Hafta içi {wdPct}%</span>
          <span><span className="text-purple-400/70">●</span> Hafta sonu {wePct}%</span>
        </div>
      </div>

      <div className="flex items-end gap-2 h-28">
        {days.map((d, i) => {
          const val = values[i];
          const pct = (val / max) * 100;
          return (
            <div key={d.key} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="w-full flex flex-col justify-end" style={{ height: "80px" }}>
                <div
                  className="w-full rounded-lg transition-all"
                  style={{
                    height: `${Math.max(pct, val > 0 ? 8 : 4)}%`,
                    backgroundColor: d.weekend ? "rgba(168,85,247,0.45)" : "rgba(29,185,84,0.45)",
                  }}
                  title={`${d.key}: ${val}`}
                />
              </div>
              <span className="text-[10px] text-white/30">{d.short}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
