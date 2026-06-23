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
    const [topTracks, topArtists, recentData] = await Promise.all([
      getTopTracks(token, "short_term", 50),
      getTopArtists(token, "short_term", 50),
      getRecentlyPlayed(token, 50),
    ]);

    const genreCount: Record<string, number> = {};
    for (const artist of topArtists.items) {
      for (const g of artist.genres ?? []) {
        genreCount[g] = (genreCount[g] ?? 0) + 1;
      }
    }
    const topGenresList = Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1])
      .map(([g]) => g);

    const listeningByHour: Record<number, number> = {};
    for (const item of recentData.items) {
      const h = new Date(item.played_at).getHours();
      listeningByHour[h] = (listeningByHour[h] ?? 0) + 1;
    }

    const nightHours = [22, 23, 0, 1, 2, 3];
    const morningHours = [6, 7, 8, 9, 10, 11];
    const totalCount = Object.values(listeningByHour).reduce((a, b) => a + b, 0);
    const nightCount = nightHours.reduce((s, h) => s + (listeningByHour[h] ?? 0), 0);
    const morningCount = morningHours.reduce((s, h) => s + (listeningByHour[h] ?? 0), 0);
    const nightRatio = totalCount > 0 ? Math.round((nightCount / totalCount) * 100) : 0;
    const morningRatio = totalCount > 0 ? Math.round((morningCount / totalCount) * 100) : 0;

    const tracks = topTracks.items ?? [];
    const avgPop = tracks.length > 0
      ? Math.round(tracks.reduce((s: number, t: any) => s + (t.popularity ?? 0), 0) / tracks.length)
      : 0;
    const undergroundCount = tracks.filter((t: any) => (t.popularity ?? 100) < 40).length;
    const mainstreamCount = tracks.filter((t: any) => (t.popularity ?? 0) > 70).length;

    // Peak listening hour
    const peakHour = Object.entries(listeningByHour).sort((a, b) => b[1] - a[1])[0];
    const peakH = peakHour ? parseInt(peakHour[0]) : -1;
    const peakLabel = peakH >= 0 ? `${peakH}:00–${peakH + 1}:00` : null;

    // Unique artists in recent 50
    const recentArtistIds = new Set<string>();
    for (const item of recentData.items) {
      for (const a of item.track?.artists ?? []) recentArtistIds.add(a.id);
    }

    const personalityTr = getMusicPersonality(topGenresList, listeningByHour, "tr");
    const personalityEn = getMusicPersonality(topGenresList, listeningByHour, "en");

    // Build rich insight list
    const insights: { tr: string; en: string; type: string }[] = [];

    if (topGenresList[0]) {
      insights.push({
        tr: `Bu dönemde en çok "${topGenresList[0]}" dinledin${topGenresList[1] ? ` ve ardından "${topGenresList[1]}" geliyor` : ""}.`,
        en: `You listened to "${topGenresList[0]}" the most this period${topGenresList[1] ? `, followed by "${topGenresList[1]}"` : ""}.`,
        type: "genre",
      });
    }

    if (topGenresList.length >= 5) {
      insights.push({
        tr: `Müzik zevkin oldukça geniş — ${topGenresList.length} farklı tür var en iyi listende.`,
        en: `Your taste is broad — ${topGenresList.length} different genres appear in your top list.`,
        type: "genre",
      });
    }

    if (nightRatio > 30) {
      insights.push({
        tr: `Dinleme zamanının %${nightRatio}'i gece saatlerinde (22:00–04:00). Gerçek bir gece kuşusun!`,
        en: `${nightRatio}% of your listening happens at night (10pm–4am). A true night owl!`,
        type: "time",
      });
    } else if (morningRatio > 30) {
      insights.push({
        tr: `Sabahları oldukça aktifsin — dinleme zamanının %${morningRatio}'i sabah saatlerinde.`,
        en: `You're a morning person — ${morningRatio}% of listening happens in the morning.`,
        type: "time",
      });
    }

    if (peakLabel) {
      insights.push({
        tr: `En yoğun müzik saatin: ${peakLabel}.`,
        en: `Your peak listening hour is ${peakLabel}.`,
        type: "time",
      });
    }

    if (topArtists.items[0]) {
      insights.push({
        tr: `En favori sanatçın ${topArtists.items[0].name}${topArtists.items[1] ? ` ve ${topArtists.items[1].name}` : ""}.`,
        en: `Your top artist is ${topArtists.items[0].name}${topArtists.items[1] ? ` followed by ${topArtists.items[1].name}` : ""}.`,
        type: "artist",
      });
    }

    if (undergroundCount > 5) {
      insights.push({
        tr: `${undergroundCount} şarkın popülerlik skoru 40'ın altında — ana akımdan uzak bir dinleyicisin.`,
        en: `${undergroundCount} of your tracks have a popularity score below 40 — you're an underground listener.`,
        type: "genre",
      });
    } else if (mainstreamCount > 10) {
      insights.push({
        tr: `En iyi parçalarının büyük çoğunluğu (%${Math.round((mainstreamCount / tracks.length) * 100)}) popüler hitlerden oluşuyor.`,
        en: `${Math.round((mainstreamCount / tracks.length) * 100)}% of your top tracks are mainstream hits.`,
        type: "genre",
      });
    }

    if (avgPop > 0) {
      insights.push({
        tr: `Dinlediğin şarkıların ortalama popülerlik skoru ${avgPop}/100.`,
        en: `Average popularity of your top tracks: ${avgPop}/100.`,
        type: "artist",
      });
    }

    if (recentArtistIds.size > 10) {
      insights.push({
        tr: `Son 50 dinlemende ${recentArtistIds.size} farklı sanatçı var — çeşitliliği seviyorsun.`,
        en: `You listened to ${recentArtistIds.size} different artists in your last 50 plays — you love variety.`,
        type: "artist",
      });
    }

    // Explorer score from real data
    const discoveryScore = Math.min(100, Math.round((undergroundCount / Math.max(tracks.length, 1)) * 200));
    const diversityScore = Math.min(100, Math.round((topGenresList.length / 15) * 100));
    const explorerScore = Math.round((discoveryScore + diversityScore) / 2);

    return NextResponse.json({
      personality: { tr: personalityTr, en: personalityEn },
      topGenres: topGenresList.slice(0, 8),
      topArtists: topArtists.items.slice(0, 5).map((a: any) => a.name),
      nightListeningPercentage: nightRatio,
      avgPopularity: avgPop,
      insights,
      explorerScore: { discoveryScore, diversityScore, explorerScore },
    });
  } catch (err: any) {
    console.error("Insights error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
