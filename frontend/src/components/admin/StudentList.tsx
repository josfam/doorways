import { useQuery } from "@tanstack/react-query";
import { sysAdminAPIUrl } from "../../constants";
import { Loading } from "../loading";
import UserList from "./userList";
import { role_names } from "../../constants";
import ErrorMessage from "../ErrorComponent";

const StudentList = () => {
  const role = role_names.student;
  const { data, isLoading, isError } = useQuery({
    queryKey: ["allStudents"],
    queryFn: async () => {
      const url = `${sysAdminAPIUrl}/users/students`;
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
    <div className="max-h-[1000px] min-h-[300px] overflow-y-auto rounded-md border-2 border-amber-200 bg-white p-10">
      {data.length > 0 ? (
        <UserList usersData={data} role={role_names.student} />
      ) : (
        <div>{`No ${role}s`}</div>
      )}
    </div>
  );
};

export default StudentList;
