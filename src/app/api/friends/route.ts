import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const friendships = await prisma.friendship.findMany({
    where: {
      OR: [
        { senderId: session.user.id, status: "accepted" },
        { receiverId: session.user.id, status: "accepted" },
      ],
    },
    include: {
      sender: { select: { id: true, name: true, image: true, spotifyId: true } },
      receiver: { select: { id: true, name: true, image: true, spotifyId: true } },
    },
  });

  const friends = friendships.map((f: any) =>
    f.senderId === session.user.id ? f.receiver : f.sender
  );

  return NextResponse.json({ friends });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { receiverId } = await req.json();

  const existing = await prisma.friendship.findFirst({
    where: {
      OR: [
        { senderId: session.user.id, receiverId },
        { senderId: receiverId, receiverId: session.user.id },
      ],
    },
  });

  if (existing) {
    return NextResponse.json({ error: "Already exists" }, { status: 400 });
  }

  const friendship = await prisma.friendship.create({
    data: { senderId: session.user.id, receiverId, status: "pending" },
  });

  return NextResponse.json({ friendship });
}
