import React from "react";
import { prisma } from "@/db";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

let currUser: any;

const checkAuthenticated = async () => {
  const cookie = await cookies();
  const userId = cookie.get("id");
  console.log(userId);
  if (userId == undefined) {
    redirect("/login");
  } else {
    currUser = await prisma.user.findUnique({
      where: {
        id: userId.value,
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
          <input type="text" className="hidden" />
          <button
            type="submit"
            className="px-4 py-1 border-black border-2 rounded-lg bg-neutral-200 hover:bg-neutral-400 active:bg-neutral-300 duration-75"
          >
            Log Out
          </button>
        </form>
      </div>
      <div className="absolute bg-white w-[10%] left-0 flex flex-col max-h-[200px]">
        <h1 className="text-2xl text-center border-2 border-black">Users</h1>
        <div className="ml-3 overflow-auto">
          {users.map((user) => {
            if (user.id !== currUser.id) {
              return (
                <h1 className="text-xl" key={user.username}>
                  {user.username}
                </h1>
              );
            }
          })}
        </div>
      </div>
    </>
  );
};

export default Home;
