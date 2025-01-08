import React from "react";

const login = async (data: FormData) => {
  "use server";
};

const page = () => {
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
              name=""
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
              name=""
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
        </div>
      </form>
    </>
  );
};

export default page;
