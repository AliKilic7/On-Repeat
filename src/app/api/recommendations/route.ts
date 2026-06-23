import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getSpotifyToken,
  getTopTracks,
  getTopArtists,
  getRecommendations,
} from "@/lib/spotify";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = await getSpotifyToken(session.user.id);
  if (!token) {
    return NextResponse.json({ error: "No token" }, { status: 401 });
  }

  try {
    const [topTracks, topArtists] = await Promise.all([
      getTopTracks(token, "short_term", 20),
      getTopArtists(token, "short_term", 20),
    ]);

    const seedArtists = topArtists.items.slice(0, 2).map((a: any) => a.id);
    const seedTracks = topTracks.items.slice(0, 2).map((t: any) => t.id);
    const topGenres = topArtists.items
      .flatMap((a: any) => a.genres ?? [])
      .slice(0, 5);
    const uniqueGenres = [...new Set<string>(topGenres)].slice(0, 1);

    const recsData = await getRecommendations(
      token,
      seedArtists,
      seedTracks,
      uniqueGenres,
      30
    );

    const knownTrackIds = new Set(topTracks.items.map((t: any) => t.id));
    const newTracks = recsData.tracks.filter(
      (t: any) => !knownTrackIds.has(t.id)
    );

    const categories = [
      "this_week_discover",
      "new_releases_for_you",
      "similar_to_recent",
      "hidden_gems",
      "rising_artists",
    ];

    const categorized = newTracks.slice(0, 25).map((track: any, i: number) => ({
      trackId: track.id,
      trackName: track.name,
      artistName: track.artists[0]?.name ?? "",
      albumName: track.album.name,
      imageUrl: track.album.images[0]?.url ?? null,
      previewUrl: track.preview_url,
      category: categories[i % categories.length],
      reason: `Based on your love of ${seedArtists.length > 0 ? topArtists.items[0]?.name : "your top artists"}`,
      score: (track.popularity ?? 50) / 100,
    }));

    return NextResponse.json({ recommendations: categorized });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { trackId, feedback } = body;

  await prisma.recommendation.updateMany({
    where: { userId: session.user.id, trackId },
    data: { feedback },
  });

  return NextResponse.json({ ok: true });
}
