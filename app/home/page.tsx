import React from "react";
import { prisma } from "@/db";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { MdOutlinePersonAddAlt } from "react-icons/md";
import { PiArrowBendDoubleUpRightBold } from "react-icons/pi";
import { revalidatePath } from "next/cache";
import { RxCross2 } from "react-icons/rx";
import UserList from "../../components/UserList";

export const dynamic = "force-dynamic";
export const revalidate = 0;

let currUser: any;

const checkAuthenticated = async () => {
  const cookie = await cookies();
  const userId = cookie.get("id");
  if (userId == undefined) {
    redirect("/login");
  } else {
    currUser = await prisma.user.findUnique({
      where: {
        id: userId.value,
      },
      include: {
        sentRequests: true,
      },
    });
    if (!currUser) {
      redirect("/login");
    }
  }
};

const logOut = async () => {
  "use server";
  const cookie = await cookies();
  cookie.delete("id");
  redirect("/login");
};

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

const getUsers = () => {
  return prisma.user.findMany({
    include: {
      receivedMessages: true,
      sentRequests: true,
    },
  });
};

const Home = async () => {
  await checkAuthenticated();
  const users = await getUsers();
  return (
    <>
      <div className="bg-blue-400 p-4 flex justify-between items-center">
        <div className="flex flex-col justify-left mx-2">
          <h1 className="text-3xl">Messaging App</h1>
          <h1 className="text-xl">Logged in as {currUser.username}</h1>
        </div>
        <form action={logOut}>
          <button
            type="submit"
            className="px-4 py-1 border-black border-2 rounded-lg bg-neutral-200 hover:bg-neutral-400 active:bg-neutral-300 duration-75"
          >
            Log Out
          </button>
        </form>
      </div>
      <UserList currUser={currUser} users={users} />
    </>
  );
};

export default Home;
