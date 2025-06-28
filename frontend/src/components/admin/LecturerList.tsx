import { useQuery } from "@tanstack/react-query";
import { role_names, sysAdminAPIUrl } from "../../constants";
import { Loading } from "../loading";
// import { Button } from '../ui/button'
import UserList from "./userList";

const LecturerList = () => {
  // api call for lecturer data
  const { data, isLoading, isError } = useQuery({
    queryKey: ["allLecturers"],
    queryFn: async () => {
      const url = `${sysAdminAPIUrl}/users/lecturers`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  if (isLoading) {
    return <Loading size="lg" text="Loading lecturers..." />;
  }

  if (isError) {
    return <div>Error loading lectures.</div>;
  }

  return (
    <div className="max-h-[1000px] min-h-[300px] overflow-y-auto rounded-md border-2 border-amber-200 bg-white p-10">
      {data.length > 0 ? (
        <UserList usersData={data} role={role_names.lecturer} />
      ) : (
        <div>No lecturers</div>
      )}
    </div>
  );
};

export default LecturerList;
