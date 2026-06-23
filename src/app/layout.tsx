import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SelfMeat — Spotify Analiz",
  description: "Müzik dinleme alışkanlıklarınızı keşfedin",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className="dark">
      <body className={`${inter.className} bg-[#0d0d1a] text-white min-h-screen`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
