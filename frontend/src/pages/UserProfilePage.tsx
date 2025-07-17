import { useQuery } from "@tanstack/react-query";
import { baseUserAPIUrl } from "@/constants";
import { useUserInfo } from "@/hooks/useUserInfo";
import { Loading } from "@/components/loading";
import { CircleUser } from "lucide-react";
import ErrorMessage from "@/components/ErrorComponent";

const UserProfilePage = () => {
  const userInfo = useUserInfo();
  const userId = userInfo?.id;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["thisUser"],
    queryFn: async () => {
      const url = `${baseUserAPIUrl}/profile/${userId}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  if (isLoading) {
    return <Loading size="lg" text={`Loading your profile...`} />;
  }

  if (isError) {
    return (
      <div className="flex w-full items-center justify-center">
        <ErrorMessage message={`Error loading your profile.`} />
      </div>
    );
  }

  return (
    <>
      <h1 className="page-header">Your Profile</h1>

      <div className="@container border-1 flex h-max w-full flex-col rounded-b-xl rounded-t-xl border border-sky-200 bg-amber-50 [--profile-card-padding:theme(spacing.10)] sm:max-w-[800px]">
        <div className="flex w-full items-center justify-start gap-4 rounded-t-xl bg-sky-100 p-[--profile-card-padding]">
          <CircleUser className="h-20 w-20 stroke-slate-400 stroke-2" />
          <div className="flex flex-col gap-1">
            <span className="border-1 block w-max rounded-lg border border-blue-300 bg-blue-50 px-2 text-blue-600">
              {data["role name"]}
            </span>
            <span className="text-xl">{`${data.surname} ${data["given name"]}`}</span>
          </div>
        </div>
        <div className="flex flex-col items-start gap-3 p-[--profile-card-padding] text-xl">
          <div className="flex flex-col sm:grid sm:grid-cols-[90px_1fr]">
            <span className="text-left font-medium">ID</span>
            <span className="text-left text-amber-900">{data.id}</span>
          </div>
          <div className="flex flex-col sm:grid sm:grid-cols-[90px_1fr]">
            <span className="text-left font-medium">Email</span>
            <span className="@xs:w-60 @md:w-full @xs:truncate text-left text-amber-900 sm:w-full">
              {data.email}
            </span>
          </div>
          <div className="flex flex-col sm:grid sm:grid-cols-[90px_1fr]">
            <span className="text-left font-medium">Phone</span>
            <span className="text-left text-amber-900">
              {data["phone number"]}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfilePage;
