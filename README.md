# On Repeat — Spotify Analiz Platformu

Spotify Wrapped deneyimini yılda bir kez değil, her an yaşatan müzik analiz platformu.

## Özellikler

- **Spotify OAuth** — Güvenli giriş
- **Derin Analizler** — Son 4 hafta / 6 ay / tüm zamanlar
- **Wrapped** — Haftalık, aylık, 3 aylık, 6 aylık raporlar + paylaşım kodu
- **Müzik Keşfi** — AI destekli kişiselleştirilmiş öneriler (beğen / kaydet / atla)
- **AI İçgörüleri** — Müzik kişiliği, dinleme alışkanlığı analizleri
- **Sosyal** — Arkadaş takip, uyumluluk skoru
- **Oyunlaştırma** — Rozetler, Kaşif Skoru, Çeşitlilik Skoru
- **Türkçe / İngilizce** desteği

## Teknolojiler

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS v4
- **UI**: Framer Motion, Recharts, Lucide React, Glassmorphism
- **Auth**: NextAuth v4 + Spotify OAuth
- **DB**: PostgreSQL + Prisma v6
- **API**: Spotify Web API

## Kurulum

\`\`\`bash
npm install
cp .env.example .env.local
npx prisma migrate dev --name init
npm run dev
\`\`\`

## Ortam Değişkenleri

\`\`\`env
DATABASE_URL="postgresql://user:password@localhost:5432/onrepeat"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"
SPOTIFY_CLIENT_ID="your-spotify-client-id"
SPOTIFY_CLIENT_SECRET="your-spotify-client-secret"
\`\`\`

## Spotify Ayarları

Redirect URI: \`http://localhost:3000/api/auth/callback/spotify\`

## Sayfalar

| Sayfa | Açıklama |
|-------|----------|
| \`/\` | Landing page + Spotify girişi |
| \`/dashboard\` | Analiz panosu |
| \`/wrapped\` | Dönemsel Wrapped raporları |
| \`/discover\` | Müzik keşif motoru |
| \`/insights\` | AI içgörüleri + rozetler |
| \`/social\` | Arkadaşlar + uyumluluk |
