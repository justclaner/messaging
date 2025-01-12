import React from "react";
import { RxCross2 } from "react-icons/rx";
import { MdOutlinePersonAddAlt } from "react-icons/md";
import { prisma } from "@/db";
import { revalidatePath } from "next/cache";

type UserProps = {
  currUser: any;
  user: any;
};

const User = async ({ currUser, user }: UserProps) => {
  const getFriendRequest = async (recipientId: string) => {
    "use server";
    const request = await prisma.friendRequest.findFirst({
      where: {
        senderId: currUser.id,
        recipientId: recipientId,
      },
    });
    return request;
  };

  const sendFriendRequest = async (recipientId: string) => {
    "use server";
    const sentRequest = await getFriendRequest(recipientId);
    if (sentRequest == null) {
      await prisma.friendRequest.create({
        data: {
          senderId: currUser.id,
          recipientId: recipientId,
        },
      });
    } else {
      await prisma.friendRequest.delete({
        where: {
          id: sentRequest.id,
        },
      });
    }
    revalidatePath("/home");
  };

  const sentRequest = await getFriendRequest(user.id);
  return (
    <div className="flex justify-between items-center" key={user.username}>
      <h1 className="text-xl">{user.username}</h1>
      <div>
        <form action={sendFriendRequest.bind(null, user.id)}>
          <button type="submit" className="block w-full h-full">
            {sentRequest != null ? (
              <RxCross2 className="mr-1 text-xl text-red-600 hover:text-red-300 active:text-red-500 hover:scale-110 active:scale-105 transition-75" />
            ) : (
              <MdOutlinePersonAddAlt className="mr-1 text-xl text-black hover:text-neutral-400 active:text-neutral-700 hover:scale-110 active:scale-105 transition-75" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default User;
