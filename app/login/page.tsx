import React from "react";
import { prisma } from "@/db";
import { redirect } from "next/navigation";
import { sha256 } from "js-sha256";
import { cookies } from "next/headers";
import Link from "next/link";
import { ObjectId } from "bson";

const login = async (data: FormData) => {
  "use server";

  const cookie = await cookies();

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
    throw new Error("user does not exist");
  }
  console.log(user);
  const hash = await user.password;
  if (sha256(password) == hash) {
    cookie.set("id", user.id);
    redirect("/");
  }

  throw new Error("Incorrect Password");
};

const page = async () => {
  const cookie = await cookies();
  console.log(cookie.get("id"));

  return (
    <>
      <h1 className="text-center text-[48px] font-bold">Messaging App</h1>
      <br />
      <form action={login}>
        <div className="flex flex-col gap-3 border rounded-xl bg-white w-fit mx-auto p-4 ">
          <h1 className="text-center text-2xl">Log In</h1>

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
              Log In
            </button>
          </div>
          <h1 className="text-lg">
            New here?
            <span className="ml-2 text-blue-300 hover:text-blue-500 active:text-blue-400 duration-75 underline">
              <Link href="/register">Register</Link>
            </span>
          </h1>
        </div>
      </form>
    </>
  );
};

export default page;
