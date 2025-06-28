import { useQuery } from "@tanstack/react-query";
import { sysAdminAPIUrl } from "../../constants";
import { Loading } from "../loading";
import UserList from "./userList";
import { role_names } from "../../constants";

const AdminList = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["allAdmins"],
    queryFn: async () => {
      const url = `${sysAdminAPIUrl}/users/admins`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  if (isLoading) {
    return <Loading size="lg" text="Loading admins..." />;
  }

  if (isError) {
    return <div>Error loading admins.</div>;
  }

  return (
    <div className="max-h-[1000px] min-h-[300px] overflow-y-auto rounded-md border-2 border-amber-200 bg-white p-10">
      {data.length > 0 ? (
        <UserList usersData={data} role={role_names.admin} />
      ) : (
        <div>No admins</div>
      )}
    </div>
  );
};

export default AdminList;
