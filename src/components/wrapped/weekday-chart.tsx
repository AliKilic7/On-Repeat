"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card } from "@/components/ui/card";

interface WeekdayChartProps {
  listeningByDayOfWeek: Record<string, number>;
  weekdayVsWeekend: { weekday: number; weekend: number };
  lang?: "tr" | "en";
}

const dayNamesTr: Record<string, string> = {
  Monday: "Pzt",
  Tuesday: "Sal",
  Wednesday: "Çar",
  Thursday: "Per",
  Friday: "Cum",
  Saturday: "Cmt",
  Sunday: "Paz",
};

export function WeekdayChart({ listeningByDayOfWeek, weekdayVsWeekend, lang = "tr" }: WeekdayChartProps) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const data = days.map((d) => ({
    name: lang === "tr" ? dayNamesTr[d] : d.slice(0, 3),
    value: listeningByDayOfWeek[d] ?? 0,
    isWeekend: d === "Saturday" || d === "Sunday",
  }));

  const total = weekdayVsWeekend.weekday + weekdayVsWeekend.weekend;
  const weekdayPct = total > 0 ? Math.round((weekdayVsWeekend.weekday / total) * 100) : 0;
  const weekendPct = 100 - weekdayPct;

  return (
    <Card>
      <h2 className="text-xl font-bold text-white mb-2">
        {lang === "tr" ? "Günlük Dinleme" : "Daily Listening"}
      </h2>
      <div className="flex gap-4 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#1DB954]" />
          <span className="text-white/60">{lang === "tr" ? "Hafta içi" : "Weekday"} {weekdayPct}%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <span className="text-white/60">{lang === "tr" ? "Hafta sonu" : "Weekend"} {weekendPct}%</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barSize={28}>
          <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              background: "#1a1a2e",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
              color: "white",
              fontSize: "12px",
            }}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.isWeekend ? "#A855F7" : "#1DB954"} opacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
