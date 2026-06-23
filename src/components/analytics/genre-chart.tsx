"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { GenreCount } from "@/types";
import { Card } from "@/components/ui/card";
import { getColorForGenre } from "@/lib/utils";

interface GenreChartProps {
  genres: GenreCount[];
  lang?: "tr" | "en";
}

export function GenreChart({ genres, lang = "tr" }: GenreChartProps) {
  const data = genres.slice(0, 8).map((g) => ({
    name: g.genre,
    value: g.count,
    color: getColorForGenre(g.genre),
  }));

  return (
    <Card>
      <h2 className="text-xl font-bold text-white mb-6">
        {lang === "tr" ? "Tür Dağılımı" : "Genre Distribution"}
      </h2>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} opacity={0.9} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a2e",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              color: "white",
            }}
          />
          <Legend
            formatter={(value) => (
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px" }}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
