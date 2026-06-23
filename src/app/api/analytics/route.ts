import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSpotifyToken, getTopTracks, getTopArtists, getRecentlyPlayed } from "@/lib/spotify";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const timeRange = (searchParams.get("time_range") ?? "short_term") as
    | "short_term"
    | "medium_term"
    | "long_term";

  const token = await getSpotifyToken(session.user.id);
  if (!token) {
    return NextResponse.json({ error: "No Spotify token" }, { status: 401 });
  }

  try {
    const [tracksData, artistsData, recentData] = await Promise.all([
      getTopTracks(token, timeRange, 50),
      getTopArtists(token, timeRange, 50),
      getRecentlyPlayed(token, 50),
    ]);

    const topGenres: Record<string, number> = {};
    for (const artist of artistsData.items) {
      for (const genre of artist.genres ?? []) {
        topGenres[genre] = (topGenres[genre] ?? 0) + 1;
      }
    }

    const genresSorted = Object.entries(topGenres)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([genre, count], _, arr) => ({
        genre,
        count,
        percentage: Math.round((count / arr[0][1]) * 100),
      }));

    const listeningByHour: Record<number, number> = {};
    const listeningByDayOfWeek: Record<string, number> = {};
    let totalMs = 0;

    for (const item of recentData.items) {
      const date = new Date(item.played_at);
      const hour = date.getHours();
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
      listeningByHour[hour] = (listeningByHour[hour] ?? 0) + 1;
      listeningByDayOfWeek[dayName] = (listeningByDayOfWeek[dayName] ?? 0) + 1;
      totalMs += item.track.duration_ms;
    }

    const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const weekdayTotal = weekdays.reduce(
      (sum, d) => sum + (listeningByDayOfWeek[d] ?? 0),
      0
    );
    const weekendTotal =
      (listeningByDayOfWeek["Saturday"] ?? 0) +
      (listeningByDayOfWeek["Sunday"] ?? 0);

    // Range-accurate metrics (top tracks/artists reflect the selected time range)
    const tracks = tracksData.items ?? [];
    const artists = artistsData.items ?? [];
    const avgPopularity =
      tracks.length > 0
        ? Math.round(
            tracks.reduce((s: number, t: any) => s + (t.popularity ?? 0), 0) /
              tracks.length
          )
        : 0;
    // Estimated total time across top tracks for this range
    const topTracksTotalMs = tracks.reduce(
      (s: number, t: any) => s + (t.duration_ms ?? 0),
      0
    );

    return NextResponse.json({
      topTracks: tracks,
      topArtists: artists,
      topGenres: genresSorted,
      // Range-accurate stats
      topTracksCount: tracks.length,
      uniqueArtistsCount: artists.length,
      uniqueGenresCount: Object.keys(topGenres).length,
      avgPopularity,
      topTracksTotalMs,
      // Recent-based stats (last ~50 plays only — Spotify API limit)
      totalListeningTimeMs: totalMs,
      uniqueTracksCount: new Set(recentData.items.map((i: any) => i.track.id)).size,
      recentPlaysCount: recentData.items.length,
      listeningByHour,
      listeningByDayOfWeek,
      weekdayVsWeekend: { weekday: weekdayTotal, weekend: weekendTotal },
    });
  } catch (err: any) {
    console.error("Analytics error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
