import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

const SPOTIFY_BASE_URL = "https://api.spotify.com/v1";

export async function getSpotifyToken(userId: string): Promise<string | null> {
  const account = await prisma.account.findFirst({
    where: { userId, provider: "spotify" },
  });
  if (!account?.access_token) return null;
  return account.access_token;
}

export async function spotifyFetch(
  endpoint: string,
  token: string,
  options: RequestInit = {}
) {
  const res = await fetch(`${SPOTIFY_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Spotify API error ${res.status}: ${error}`);
  }
  return res.json();
}

export async function getTopTracks(
  token: string,
  timeRange: "short_term" | "medium_term" | "long_term" = "short_term",
  limit = 50
) {
  return spotifyFetch(
    `/me/top/tracks?time_range=${timeRange}&limit=${limit}`,
    token
  );
}

export async function getTopArtists(
  token: string,
  timeRange: "short_term" | "medium_term" | "long_term" = "short_term",
  limit = 50
) {
  return spotifyFetch(
    `/me/top/artists?time_range=${timeRange}&limit=${limit}`,
    token
  );
}

export async function getRecentlyPlayed(token: string, limit = 50) {
  return spotifyFetch(`/me/player/recently-played?limit=${limit}`, token);
}

export async function getUserProfile(token: string) {
  return spotifyFetch("/me", token);
}

export async function getRecommendations(
  token: string,
  seedArtists: string[],
  seedTracks: string[],
  seedGenres: string[],
  limit = 20
) {
  const params = new URLSearchParams({
    limit: String(limit),
    seed_artists: seedArtists.slice(0, 2).join(","),
    seed_tracks: seedTracks.slice(0, 2).join(","),
    seed_genres: seedGenres.slice(0, 1).join(","),
  });
  return spotifyFetch(`/recommendations?${params}`, token);
}

export async function getArtistDetails(token: string, artistId: string) {
  return spotifyFetch(`/artists/${artistId}`, token);
}

export async function getAudioFeatures(token: string, trackIds: string[]) {
  return spotifyFetch(
    `/audio-features?ids=${trackIds.slice(0, 100).join(",")}`,
    token
  );
}

export function timeRangeToLabel(
  timeRange: string,
  lang: "tr" | "en" = "tr"
): string {
  const labels: Record<string, Record<string, string>> = {
    short_term: { tr: "Son 4 Hafta", en: "Last 4 Weeks" },
    medium_term: { tr: "Son 6 Ay", en: "Last 6 Months" },
    long_term: { tr: "Tüm Zamanlar", en: "All Time" },
    "7d": { tr: "Son 7 Gün", en: "Last 7 Days" },
    "30d": { tr: "Son 30 Gün", en: "Last 30 Days" },
    "90d": { tr: "Son 90 Gün", en: "Last 90 Days" },
    "180d": { tr: "Son 180 Gün", en: "Last 180 Days" },
  };
  return labels[timeRange]?.[lang] ?? timeRange;
}
