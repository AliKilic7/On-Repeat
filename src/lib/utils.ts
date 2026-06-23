import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(ms: number): string {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  if (hours > 0) return `${hours}s ${minutes}d`;
  return `${minutes} dakika`;
}

export function formatDurationEn(ms: number): string {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes} min`;
}

export function msToMinutes(ms: number): number {
  return Math.round(ms / 60000);
}

export function getTimeOfDay(hour: number): string {
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

export function generateShareCode(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

export function getColorForGenre(genre: string): string {
  const colors = [
    "#1DB954", "#E91429", "#FF6B35", "#A855F7", "#3B82F6",
    "#F59E0B", "#EC4899", "#06B6D4", "#84CC16", "#F97316",
  ];
  let hash = 0;
  for (let i = 0; i < genre.length; i++) {
    hash = genre.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function getMusicPersonality(
  topGenres: string[],
  listeningHours: Record<number, number>,
  lang: "tr" | "en" = "tr"
): string {
  const nightHours = [22, 23, 0, 1, 2, 3];
  const nightListening = nightHours.reduce(
    (sum, h) => sum + (listeningHours[h] ?? 0),
    0
  );
  const totalListening = Object.values(listeningHours).reduce((a, b) => a + b, 0);
  const nightRatio = totalListening > 0 ? nightListening / totalListening : 0;

  const personalities = {
    tr: {
      night: "Gece Dinleyicisi",
      nostalgic: "Nostalji Avcısı",
      indie: "Indie Kaşifi",
      rock: "Rock Tutkunu",
      collector: "Tür Koleksiyoncusu",
      hithunter: "Hit Avcısı",
      underground: "Underground Kaşifi",
    },
    en: {
      night: "Night Listener",
      nostalgic: "Nostalgia Hunter",
      indie: "Indie Explorer",
      rock: "Rock Enthusiast",
      collector: "Genre Collector",
      hithunter: "Hit Hunter",
      underground: "Underground Explorer",
    },
  };

  const p = personalities[lang];
  if (nightRatio > 0.4) return p.night;
  if (topGenres.some((g) => g.includes("rock"))) return p.rock;
  if (topGenres.some((g) => g.includes("indie"))) return p.indie;
  if (topGenres.length > 8) return p.collector;
  return p.hithunter;
}
