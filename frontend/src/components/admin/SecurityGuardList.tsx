import { useQuery } from "@tanstack/react-query";
import { sysAdminAPIUrl, role_names } from "../../constants";
import { Loading } from "../loading";
import UserList from "./userList";

const SecurityGuardList = () => {
  // api call for security guard data
  const { data, isLoading, isError } = useQuery({
    queryKey: ["allSecurityGuards"],
    queryFn: async () => {
      const url = `${sysAdminAPIUrl}/users/security-guards`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  if (isLoading) {
    return <Loading size="lg" text="Loading guards..." />;
  }

  if (isError) {
    return <div>Error loading guards.</div>;
  }

  return (
    <div className="max-h-[1000px] min-h-[300px] overflow-y-auto rounded-md border-2 border-amber-200 bg-white p-10">
      {data.length > 0 ? (
        <UserList usersData={data} role={role_names.security} />
      ) : (
        <div>No guards</div>
      )}
    </div>
  );
};

export default SecurityGuardList;
