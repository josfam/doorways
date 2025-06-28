import UserUpdateDialog from "./UserUpdateDialog";
import { UserDetailsArray } from "@/types/types";
interface UserListProps {
  usersData: UserDetailsArray;
  role: string;
}

const UserList = ({ usersData, role }: UserListProps) => {
  return (
    <ul className="flex w-full flex-col gap-8">
      {usersData.map((user) => (
        <li
          key={user.id}
          className="flex content-center items-center rounded bg-sky-100 p-4 text-lg"
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

export default UserList;
