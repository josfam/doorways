import { useQuery } from "@tanstack/react-query";
import { baseAPIUrl } from "../../constants";
// import { Button } from '../ui/button'
import UserList from "./userList";

const StudentList = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const url = `${baseAPIUrl}/admin/users/students`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading students.</div>;
  }

  return (
    <div className="border-1 max-h-[500px] min-h-[300px] overflow-y-auto rounded-md bg-white p-10">
      {data.length > 0 ? <UserList data={data} /> : <div>No students</div>}
    </div>
  );
};

export default StudentList;
