import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const users = await prisma.user.findMany({
    include: {
      receivedRequests: true,
      sentRequests: true,
    },
  });
  return NextResponse.json(users, { status: 200 });
}

export async function POST(req: NextRequest) {
  return NextResponse.json("fuck");
}
