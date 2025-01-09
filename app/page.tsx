"use server";
import React from "react";
import { prisma } from "@/db";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const checkAuthenticated = async () => {
  const cookie = await cookies();
  const userId = cookie.get("id");
  console.log(userId);
  if (userId == undefined) {
    redirect("/login");
  } else {
    const user = await prisma.user.findUnique({
      where: {
        id: userId.value,
      },
    });
    if (!user) {
      redirect("/login");
    }
  }
};

const getUsers = () => {
  return prisma.user.findMany();
};

const Home = async () => {
  await checkAuthenticated();
  const users = await getUsers();
  return (
    <>
      <div className="bg-blue-400 p-4 flex justify-left">
        <h1 className=" mx-2 text-3xl">Messaging App</h1>
      </div>
      <div className="absolute p-4 bg-white w-[10%] left-0 flex flex-col max-h-[200px] overflow-auto">
        <h1 className="text-2xl text-center">Users</h1>
        {users.map((user) => (
          <h1 className="text-xl">{user.username}</h1>
        ))}
      </div>
    </>
  );
};

export default Home;
