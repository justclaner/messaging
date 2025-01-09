import React from "react";
import { prisma } from "@/db";
import { sha256 } from "js-sha256";
import { redirect } from "next/navigation";
import Link from "next/link";

const register = async (data: FormData) => {
  "use server";
  // await prisma.room.create({
  //   data: {
  //     roomName: "global",
  //   },
  // });
  const username = data.get("username")?.valueOf();
  const password = data.get("password")?.valueOf();

  if (typeof username !== "string") {
    throw new Error("Invalid username");
  }

  if (typeof password !== "string") {
    throw new Error("Invalid password");
  }

  if (username.length == 0 || password.length == 0) {
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  if (!user) {
    //register the user here
    await prisma.user.create({
      data: {
        username: username,
        password: sha256(password),
      },
    });
    console.log("user successfully created");
    redirect("/login");
  } else {
    console.log("user already exists with username " + username);
  }
};

const page = () => {
  return (
    <>
      <h1 className="text-center text-[48px] font-bold">Messaging App</h1>
      <br />
      <form action={register}>
        <div className="flex flex-col gap-3 border rounded-xl bg-white w-fit mx-auto p-4 ">
          <h1 className="text-center text-2xl">Register</h1>

          <div className="flex items-center gap-2 justify-between">
            <label htmlFor="usernameInput" className="text-xl">
              Username:
            </label>
            <input
              type="text"
              name="username"
              id="usernameInput"
              placeholder="SparklingLemons47"
              className="border-2 rounded-lg shadow-xl px-2 py-1"
            />
          </div>
          <div className="flex items-center gap-2 justify-between">
            <label htmlFor="passwordInput" className="text-xl">
              Password:
            </label>
            <input
              type="text"
              name="password"
              placeholder="123456789"
              id="passwordInput"
              className="border-2 rounded-lg shadow-xl px-2 py-1"
            />
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="px-4 py-1 border-black border-2 rounded-lg bg-neutral-200 hover:bg-neutral-400 active:bg-neutral-300 duration-75"
            >
              Register
            </button>
          </div>
          <h1 className="text-lg">
            Already have an account?
            <span className="ml-2 text-blue-300 hover:text-blue-500 active:text-blue-400 duration-75 underline">
              <Link href="/login">Log In</Link>
            </span>
          </h1>
        </div>
      </form>
    </>
  );
};

export default page;
