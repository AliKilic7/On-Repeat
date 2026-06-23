import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

const SPOTIFY_BASE_URL = "https://api.spotify.com/v1";

export async function getSpotifyToken(userId: string): Promise<string | null> {
  const account = await prisma.account.findFirst({
    where: { userId, provider: "spotify" },
  });
  if (!account?.access_token) return null;

  // Spotify access tokens expire after 1 hour. Refresh if expired (60s buffer).
  const now = Math.floor(Date.now() / 1000);
  const isExpired = !account.expires_at || account.expires_at <= now + 60;

  if (isExpired && account.refresh_token) {
    try {
      const refreshed = await refreshSpotifyToken(account.refresh_token);
      await prisma.account.update({
        where: { id: account.id },
        data: {
          access_token: refreshed.access_token,
          expires_at: now + (refreshed.expires_in ?? 3600),
          // Spotify may or may not return a new refresh token
          refresh_token: refreshed.refresh_token ?? account.refresh_token,
        },
      });
      return refreshed.access_token;
    } catch (err) {
      console.error("Spotify token refresh failed:", err);
      // Fall back to the existing token (may still work or fail downstream)
      return account.access_token;
    }
  }

  return account.access_token;
}

async function refreshSpotifyToken(refreshToken: string): Promise<{
  access_token: string;
  expires_in?: number;
  refresh_token?: string;
}> {
  const basic = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) {
    throw new Error(`Token refresh error ${res.status}: ${await res.text()}`);
  }
  return res.json();
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
