"use client";
import { useState } from "react";
import User from "./User";

type UserListProps = {
  users: any[];
  currUser: any;
};

const UserList = ({ users, currUser }: UserListProps) => {
  const [userSearch, setUserSearch] = useState("");
  return (
    <div className="bg-white w-[10%] left-0 flex flex-col max-h-[200px] border-2 border-black">
      <h1 className="text-2xl text-center border-b-2 border-black">Users</h1>
      <input
        type="text"
        name=""
        id="searchUser"
        className="border-2 border-black mx-2 my-1 px-2 py-1 text-sm"
        placeholder="Search for a user..."
        onChange={(e) => {
          setUserSearch(e.target.value);
        }}
      />
      <div className="ml-1 overflow-auto">
        {users.map((user) => {
          if (
            user.id !== currUser.id &&
            (user.username.includes(userSearch) || userSearch == "")
          ) {
            return <User key={user.id} currUser={currUser} user={user} />;
          }
        })}
      </div>
    </div>
  );
};

export default UserList;
