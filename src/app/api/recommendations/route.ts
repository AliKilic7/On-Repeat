import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSpotifyToken, getTopTracks, getTopArtists, spotifyFetch } from "@/lib/spotify";
import { prisma } from "@/lib/db";

const categories = [
  "this_week_discover",
  "new_releases_for_you",
  "similar_to_recent",
  "hidden_gems",
  "rising_artists",
];

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
      getTopArtists(token, "short_term", 10),
    ]);

    const knownTrackIds = new Set(topTracks.items.map((t: any) => t.id));
    const knownArtistIds = new Set(topArtists.items.map((a: any) => a.id));

    // Get related artists for top 5 artists
    const seedArtists: any[] = topArtists.items.slice(0, 5);
    const relatedResults = await Promise.allSettled(
      seedArtists.map((a: any) =>
        spotifyFetch(`/artists/${a.id}/related-artists`, token)
      )
    );

    const relatedArtistIds: string[] = [];
    for (const result of relatedResults) {
      if (result.status === "fulfilled" && result.value?.artists) {
        for (const ra of result.value.artists.slice(0, 3)) {
          if (!knownArtistIds.has(ra.id) && !relatedArtistIds.includes(ra.id)) {
            relatedArtistIds.push(ra.id);
          }
        }
      }
    }

    // Get top tracks from related artists
    const trackResults = await Promise.allSettled(
      relatedArtistIds.slice(0, 10).map((id) =>
        spotifyFetch(`/artists/${id}/top-tracks?market=TR`, token)
      )
    );

    const discovered: any[] = [];
    for (const result of trackResults) {
      if (result.status === "fulfilled" && result.value?.tracks) {
        for (const track of result.value.tracks.slice(0, 3)) {
          if (!knownTrackIds.has(track.id) && !discovered.find(d => d.trackId === track.id)) {
            discovered.push({
              trackId: track.id,
              trackName: track.name,
              artistName: track.artists[0]?.name ?? "",
              albumName: track.album?.name ?? "",
              imageUrl: track.album?.images?.[0]?.url ?? null,
              previewUrl: track.preview_url ?? null,
              category: categories[discovered.length % categories.length],
              reason: `Sevdiğin sanatçılara benzer`,
              score: (track.popularity ?? 50) / 100,
            });
          }
          if (discovered.length >= 25) break;
        }
        if (discovered.length >= 25) break;
      }
    }

    return NextResponse.json({ recommendations: discovered });
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
