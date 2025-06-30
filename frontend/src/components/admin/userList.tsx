import UserUpdateDialog from "./UserUpdateDialog";
import { UserDetailsArray } from "@/types/types";
import React, { ReactNode } from "react";
interface UserListContainerProps {
  children: ReactNode;
}

interface UserListProps {
  usersData: UserDetailsArray;
  role: string;
}

export const UserList = ({ usersData, role }: UserListProps) => {
  return (
    <ul className="flex w-full flex-col gap-4">
      {usersData.map((user) => (
        <li
          key={user.id}
          className="flex content-center items-center rounded bg-sky-100 px-4 py-3 text-lg"
        >
          <div className="flex gap-4">
            <div className="font-semibold">{user.surname}</div>
            <div className="font-semibold">{user["given name"]}</div>
            <div>{`( ${user.id} )`}</div>
          </div>
          <div className="ml-auto flex gap-4">
            <UserUpdateDialog userData={user} role={role} />
          </div>
        </li>
      ))}
    </ul>
  );
};

export const UserListContainer: React.FC<UserListContainerProps> = ({
  children,
}) => {
  return (
    <div className="flex max-h-[1000px] min-h-[300px] flex-col items-center justify-center overflow-y-auto rounded-md border-2 border-amber-200 bg-white p-10">
      {children}
    </div>
  );
};

// export default UserList;
