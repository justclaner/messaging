import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const friendRequests = await prisma.friendRequest.findMany({
    include: {
      sender: true,
      recipient: true,
    },
  });
  return NextResponse.json(friendRequests, { status: 200 });
}
