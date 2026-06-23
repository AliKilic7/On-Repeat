export interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  duration_ms: number;
  popularity: number;
  preview_url: string | null;
  external_urls: { spotify: string };
}

export interface SpotifyArtist {
  id: string;
  name: string;
  genres: string[];
  popularity: number;
  images: SpotifyImage[];
  followers?: { total: number };
  external_urls: { spotify: string };
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  images: SpotifyImage[];
  release_date: string;
  artists: SpotifyArtist[];
  external_urls: { spotify: string };
}

export interface SpotifyImage {
  url: string;
  width: number;
  height: number;
}

export interface TopTracksResponse {
  items: SpotifyTrack[];
  total: number;
}

export interface TopArtistsResponse {
  items: SpotifyArtist[];
  total: number;
}

export interface RecentlyPlayedResponse {
  items: { track: SpotifyTrack; played_at: string }[];
  next: string | null;
}

export type TimeRange = "short_term" | "medium_term" | "long_term";
export type Period = "7d" | "30d" | "90d" | "180d";
export type WrappedPeriod = "weekly" | "monthly" | "3monthly" | "6monthly";
export type Language = "tr" | "en";

export interface AnalyticsData {
  topTracks: SpotifyTrack[];
  topArtists: SpotifyArtist[];
  topGenres: GenreCount[];
  totalListeningTimeMs: number;
  uniqueTracksCount: number;
  uniqueArtistsCount: number;
  listeningByHour: Record<number, number>;
  listeningByDay: Record<string, number>;
  listeningByDayOfWeek: Record<string, number>;
  weekdayVsWeekend: { weekday: number; weekend: number };
}

export interface GenreCount {
  genre: string;
  count: number;
  percentage: number;
}

export interface MusicPersonality {
  type: string;
  description: string;
  traits: string[];
  color: string;
  icon: string;
}

export interface Friend {
  id: string;
  name: string | null;
  image: string | null;
  spotifyId: string | null;
  compatibilityScore?: number;
  commonArtists?: string[];
  commonTracks?: string[];
  commonGenres?: string[];
}

export interface Badge {
  id: string;
  key: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  icon: string;
  color: string;
  earnedAt?: Date;
}

export interface Recommendation {
  id: string;
  trackId: string;
  trackName: string;
  artistName: string;
  albumName: string;
  imageUrl: string | null;
  previewUrl: string | null;
  category: string;
  reason: string;
  score: number;
  feedback: string | null;
}

export interface ExplorerScore {
  discoveryScore: number;
  diversityScore: number;
  explorerScore: number;
  totalTracks: number;
  uniqueArtists: number;
  uniqueGenres: number;
}
