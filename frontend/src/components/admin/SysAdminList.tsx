import { useQuery } from "@tanstack/react-query";
import { sysAdminAPIUrl } from "../../constants";
import { Loading } from "../loading";
import { UserList, UserListContainer } from "./userList";
import { role_names } from "../../constants";
import ErrorMessage from "../ErrorComponent";
import { Link } from "react-router-dom";
import { routeUrl } from "@/routing";

const SysAdminList = () => {
  const role = role_names["sys admin"];
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
    return <Loading size="lg" text={`Loading ${role}s...`} />;
  }

  if (isError) {
    return (
      <div className="flex w-full items-center justify-center">
        <ErrorMessage message={`Error loading ${role}s`} />
      </div>
    );
  }

  return (
    <UserListContainer
      children={
        <>
          {data.data.length > 0 ? (
            <UserList usersData={data.data} role={role_names["sys admin"]} />
          ) : (
            <div className="flex flex-col gap-2 text-2xl">
              <p>{`${data.message}`}</p>
              <Link to={`${routeUrl.absolutes.sysAdminAddUsers}`}>
                Add some
              </Link>
            </div>
          )}
        </>
      }
    />
  );
};

export default SysAdminList;
