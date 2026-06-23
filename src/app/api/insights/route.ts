import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSpotifyToken, getTopTracks, getTopArtists, getRecentlyPlayed } from "@/lib/spotify";
import { getMusicPersonality } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = await getSpotifyToken(session.user.id);
  if (!token) return NextResponse.json({ error: "No token" }, { status: 401 });

  try {
    const [topArtists, recentData] = await Promise.all([
      getTopArtists(token, "short_term", 20),
      getRecentlyPlayed(token, 50),
    ]);

    const topGenres = topArtists.items
      .flatMap((a: any) => a.genres)
      .reduce((acc: Record<string, number>, g: string) => {
        acc[g] = (acc[g] ?? 0) + 1;
        return acc;
      }, {});

    const listeningByHour: Record<number, number> = {};
    for (const item of recentData.items) {
      const h = new Date(item.played_at).getHours();
      listeningByHour[h] = (listeningByHour[h] ?? 0) + 1;
    }

    const topGenresList = Object.entries(topGenres)
      .sort((a: any, b: any) => b[1] - a[1])
      .map(([g]) => g);

    const personalityTr = getMusicPersonality(topGenresList, listeningByHour, "tr");
    const personalityEn = getMusicPersonality(topGenresList, listeningByHour, "en");

    const nightHours = [22, 23, 0, 1, 2, 3];
    const nightCount = nightHours.reduce((s, h) => s + (listeningByHour[h] ?? 0), 0);
    const totalCount = Object.values(listeningByHour).reduce((a, b) => a + b, 0);
    const nightRatio = totalCount > 0 ? Math.round((nightCount / totalCount) * 100) : 0;

    const insights = {
      personality: { tr: personalityTr, en: personalityEn },
      topGenres: topGenresList.slice(0, 5),
      topArtists: topArtists.items.slice(0, 3).map((a: any) => a.name),
      nightListeningPercentage: nightRatio,
      insights: [
        {
          tr: `Bu dönemde en çok ${topGenresList[0] ?? "çeşitli"} dinledin.`,
          en: `You listened to ${topGenresList[0] ?? "various genres"} the most this period.`,
          type: "genre",
        },
        {
          tr: `Dinleme zamanının %${nightRatio}'i gece saatlerine ait.`,
          en: `${nightRatio}% of your listening is during night hours.`,
          type: "time",
        },
        {
          tr: `En sevdiğin sanatçı: ${topArtists.items[0]?.name ?? "Bilinmiyor"}.`,
          en: `Your favorite artist: ${topArtists.items[0]?.name ?? "Unknown"}.`,
          type: "artist",
        },
      ],
    };

    return NextResponse.json(insights);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
