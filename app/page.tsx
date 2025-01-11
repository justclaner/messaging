import React from "react";
import { prisma } from "@/db";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { MdOutlinePersonAddAlt } from "react-icons/md";
import { PiArrowBendDoubleUpRightBold } from "react-icons/pi";
import { revalidatePath } from "next/cache";
import { HiH1 } from "react-icons/hi2";

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
  revalidatePath("/");
};

const getUsers = () => {
  return prisma.user.findMany();
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
      <div className="bg-white w-[10%] left-0 flex flex-col max-h-[200px]">
        <h1 className="text-2xl text-center border-2 border-black">Users</h1>
        <div className="ml-3 overflow-auto">
          {users.map(async (user) => {
            const sentRequest = await getFriendRequest(user.id);
            if (user.id !== currUser.id) {
              return (
                <div
                  className="flex justify-between items-center"
                  key={user.username}
                >
                  <h1 className="text-xl">{user.username}</h1>
                  <div>
                    <form action={sendFriendRequest.bind(null, user.id)}>
                      <button type="submit" className="block w-full h-full">
                        {sentRequest != null ? (
                          <PiArrowBendDoubleUpRightBold className="mr-1 text-xl text-neutral-700" />
                        ) : (
                          <MdOutlinePersonAddAlt className="mr-1 text-xl text-black hover:text-neutral-400 active:text-neutral-700 hover:scale-110 active:scale-105 transition-75" />
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>
    </>
  );
};

export default Home;
