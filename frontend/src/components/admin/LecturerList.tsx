import { useQuery } from "@tanstack/react-query";
import { baseAPIUrl } from "../../constants";
// import { Button } from '../ui/button'
import UserList from "./userList";

const LecturerList = () => {
  // api call for lecturer data
  const { data, isLoading, isError } = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const url = `${baseAPIUrl}/admin/users/lecturers`;
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
    <div className="border-1 min-h-[500px] overflow-y-auto rounded-md bg-white p-10">
      {data.length > 0 ? <UserList data={data} /> : <div>No lecturers</div>}
    </div>
  );
};

export default LecturerList;
