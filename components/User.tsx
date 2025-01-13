"use client";
import { useState, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import { MdOutlinePersonAddAlt } from "react-icons/md";
import { default as axios } from "axios";

type UserProps = {
  currUser: any;
  user: any;
};

const User = ({ currUser, user }: UserProps) => {
  const [sentRequest, setSentRequest] = useState(false);
  const url = "http://127.0.0.1:3000/api/users";

  useEffect(() => {
    checkReceivedFriendRequest(user.id);
  }, []);

  const checkReceivedFriendRequest = async (recipientId: string) => {
    const res = await axios.get(`${url}/${recipientId}`);
    const receivedRequests = res.data.receivedRequests;
    for (let i = 0; i < receivedRequests.length; i++) {
      if (receivedRequests[i].senderId == currUser.id) {
        setSentRequest(true);
        return;
      }
    }
    return;
  };

  const sendFriendRequest = async (recipientId: string) => {
    console.log(recipientId);
  };

  return (
    <div
      className="border-b border-black flex justify-between items-center"
      key={user.username}
    >
      <h1 className="text-xl">{user.username}</h1>
      <div>
        <button
          className="block w-full h-full"
          onClick={() => sendFriendRequest(user.id)}
        >
          {sentRequest ? (
            <RxCross2 className="mr-1 text-xl text-red-600 hover:text-red-300 active:text-red-500 hover:scale-110 active:scale-105 transition-75" />
          ) : (
            <MdOutlinePersonAddAlt className="mr-1 text-xl text-black hover:text-neutral-400 active:text-neutral-700 hover:scale-110 active:scale-105 transition-75" />
          )}
        </button>
      </div>
    </div>
  );
};

export default User;
