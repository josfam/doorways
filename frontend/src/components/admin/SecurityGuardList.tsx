import { useQuery } from "@tanstack/react-query";
import { sysAdminAPIUrl, role_names } from "../../constants";
import { Loading } from "../loading";
import { UserList, UserListContainer } from "./userList";
import ErrorMessage from "../ErrorComponent";
import { Link } from "react-router-dom";
import { routeUrl } from "@/routing";

const SecurityGuardList = () => {
  const role = role_names.security;
  // api call for security guard data
  const { data, isLoading, isError } = useQuery({
    queryKey: ["allSecurityGuards"],
    queryFn: async () => {
      const url = `${sysAdminAPIUrl}/users/security-guards`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    },
  });

  if (isLoading) {
    return <Loading size="lg" text={`Loading ${role} guards...`} />;
  }

  if (isError) {
    return (
      <div className="flex w-full items-center justify-center">
        <ErrorMessage message={`Error loading ${role} guards`} />
      </div>
    );
  }
  return (
    <UserListContainer
      children={
        <>
          {data.data.length > 0 ? (
            <UserList usersData={data.data} role={role_names.security} />
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

export default SecurityGuardList;
