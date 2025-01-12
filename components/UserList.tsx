import { prisma } from "@/db";
import User from "./User";

type UserListProps = {
  currUser: any;
};

const UserList = async ({ currUser }: UserListProps) => {
  const users = await prisma.user.findMany();

  return (
    <div className="bg-white w-[10%] left-0 flex flex-col max-h-[200px]">
      <h1 className="text-2xl text-center border-2 border-black">Users</h1>
      <div className="ml-3 overflow-auto">
        {users.map(async (user) => {
          if (user.id !== currUser.id) {
            return <User currUser={currUser} user={user} />;
          }
        })}
      </div>
    </div>
  );
};

export default UserList;
