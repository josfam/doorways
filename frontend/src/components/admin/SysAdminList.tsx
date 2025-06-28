import { useQuery } from "@tanstack/react-query";
import { sysAdminAPIUrl } from "../../constants";
import { Loading } from "../loading";
import UserList from "./userList";
import { role_names } from "../../constants";

const SysAdminList = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["allSysAdmins"],
    queryFn: async () => {
      const url = `${sysAdminAPIUrl}/users/sys-admins`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  if (isLoading) {
    return <Loading size="lg" text="Loading sys admins..." />;
  }

  if (isError) {
    return <div>Error loading sys admins.</div>;
  }

  return (
    <div className="max-h-[1000px] min-h-[300px] overflow-y-auto rounded-md border-2 border-amber-200 bg-white p-10">
      {data.length > 0 ? (
        <UserList usersData={data} role={role_names["sys admin"]} />
      ) : (
        <div>No sys admins</div>
      )}
    </div>
  );
};

export default SysAdminList;
