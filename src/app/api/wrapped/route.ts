import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getSpotifyToken,
  getTopTracks,
  getTopArtists,
  getRecentlyPlayed,
} from "@/lib/spotify";
import { generateShareCode } from "@/lib/utils";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period") ?? "weekly";

  const token = await getSpotifyToken(session.user.id);
  if (!token) {
    return NextResponse.json({ error: "No token" }, { status: 401 });
  }

  let timeRange: "short_term" | "medium_term" | "long_term" = "short_term";
  if (period === "3monthly" || period === "6monthly") timeRange = "medium_term";

  try {
    const [tracksData, artistsData, recentData] = await Promise.all([
      getTopTracks(token, timeRange, 10),
      getTopArtists(token, timeRange, 10),
      getRecentlyPlayed(token, 50),
    ]);

    const topGenres: Record<string, number> = {};
    for (const artist of artistsData.items) {
      for (const genre of artist.genres ?? []) {
        topGenres[genre] = (topGenres[genre] ?? 0) + 1;
      }
    }

    const genreList = Object.entries(topGenres)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([g]) => g);

    const totalMs = recentData.items.reduce(
      (sum: number, i: any) => sum + i.track.duration_ms,
      0
    );

    const data = {
      topTracks: tracksData.items.slice(0, 5),
      topArtists: artistsData.items.slice(0, 5),
      topGenres: genreList,
      totalListeningTimeMs: totalMs,
      tracksCount: recentData.items.length,
    };

    const shareCode = generateShareCode();
    await prisma.wrappedReport.create({
      data: {
        userId: session.user.id,
        period,
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(),
        data,
        shareCode,
      },
    });

    return NextResponse.json({ ...data, shareCode, period });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
