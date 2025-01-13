import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { senderId, recipientId } = await req.json();
  if (typeof senderId != "string" || typeof recipientId != "string") {
    throw Error("Ids are not strings");
  }
  try {
    const friendReq = await prisma.friendRequest.findFirst({
      where: {
        senderId: senderId,
        recipientId: recipientId,
      },
    });
    if (!friendReq) {
      throw Error("Haven't sent friend request");
    }

    const result = await prisma.friendRequest.delete({
      where: {
        senderId: senderId,
        recipientId: recipientId,
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: e, message: "Invalid request body" },
      { status: 400 }
    );
  }
  return NextResponse.json(
    `User with id ${senderId} has successfully sent a friend request to user with id ${recipientId}.`,
    { status: 201 }
  );
}
