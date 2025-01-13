"use client";
import { prisma } from "@/db";
import User from "./User";

type UserListProps = {
  users: any[];
  currUser: any;
};

const UserList = ({ users, currUser }: UserListProps) => {
  return (
    <div className="bg-white w-[10%] left-0 flex flex-col max-h-[200px]">
      <h1 className="text-2xl text-center border-2 border-black">Users</h1>
      <div className="ml-3 overflow-auto">
        {users.map((user) => {
          if (user.id !== currUser.id) {
            return <User key={user.id} currUser={currUser} user={user} />;
          }
        })}
      </div>
    </div>
  );
};

export default UserList;
