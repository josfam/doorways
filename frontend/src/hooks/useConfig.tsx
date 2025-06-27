import { useQuery } from "@tanstack/react-query";
import { authAPIUrl } from "@/constants";

export const useConfig = () => {
  return useQuery({
    queryKey: ["appConfig"],
    queryFn: async () => {
      const url = `${authAPIUrl}/config`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    staleTime: 5 * 1000,
    gcTime: 10 * 1000,
  });
};
