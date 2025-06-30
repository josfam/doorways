import {} from "@/constants";
import { useQuery } from "@tanstack/react-query";
import type { JwtPayload, transitionItem } from "@/types/types";
import { jwtDecode } from "jwt-decode";
import { statsAPIUrl } from "@/constants";
import SingleTransitionDetail from "@/components/singleTransitionDetail";
import { Loading } from "@/components/loading";
import ErrorMessage from "@/components/ErrorComponent";
import { Link } from "react-router-dom";
import { routeUrl } from "@/routing";
// import { useIsMobile } from "@/hooks/use-mobile";

const UserActivityHistoryPage = () => {
  // const isMobile = useIsMobile();

  // fetch the user's id from the jwt token
  const token = localStorage.getItem("jwt_token");

  const userId = jwtDecode<JwtPayload>(token).id;

  // fetch user activity history from the API
  const { data, isLoading, isError } = useQuery({
    queryKey: ["userActivityHistory", userId],
    queryFn: async () => {
      const url = `${statsAPIUrl}/activity-history/user/${userId}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    },
  });

  if (isLoading) {
    return <Loading size="lg" text={`fetching your history`} />;
  }

  if (isError) {
    return (
      <div className="flex w-full items-center justify-center">
        <ErrorMessage message={`Can't load history right now.`} />
      </div>
    );
  }

  // Format the date into a human-readable format
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    // const weekday = date.toLocaleString("default", { weekday: "short" });

    return `${day}-${month}-${year}`;
    // Hide weekday on mobile devices
    // return isMobile
    //   ? `${day}-${month}-${year}`
    //   : `${weekday}-${day}-${month}-${year}`;
  };

  // Format the time into a human-readable format
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // Get transition type text from id
  const getTransitionTypeText = (typeId: number) => {
    switch (typeId) {
      case 1:
        return "entry";
      case 2:
        return "exit";
      default:
        return "unknown";
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-20">
      <div>
        <h1 className="page-header">Your History</h1>
      </div>
      <ul className="flex w-full flex-wrap items-center justify-center gap-4">
        {data.data.length > 0 ? (
          data.data.map((transitionItem: transitionItem) => (
            <SingleTransitionDetail
              key={transitionItem.id}
              transitionData={{
                transitionDate: formatDate(transitionItem.time),
                transitionTime: formatTime(transitionItem.time),
                transitionType: getTransitionTypeText(
                  transitionItem.transition_type_id,
                ),
              }}
            />
          ))
        ) : (
          <div className="flex min-h-[200px] w-full flex-col items-center justify-center gap-2 rounded-lg bg-amber-100 text-2xl">
            <p>{`${data.message}`}</p>
            <Link to={`${routeUrl.absolutes.userCodeRequest}`}>
              Request a code to start
            </Link>
          </div>
        )}
      </ul>
    </div>
  );
};

export default UserActivityHistoryPage;
