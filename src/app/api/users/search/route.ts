import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const spotifyId = searchParams.get("spotifyId")?.replace("spotify:user:", "").trim();

  if (!spotifyId) {
    return NextResponse.json({ error: "spotifyId required" }, { status: 400 });
  }

  const user = await prisma.user.findFirst({
    where: { spotifyId },
    select: { id: true, name: true, image: true, spotifyId: true },
  });

  if (!user || user.id === session.user.id) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({ user });
}
