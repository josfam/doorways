// import { useQuery } from "@tanstack/react-query";
// import { baseAPIUrl } from "@/constants";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CodeEntryPage = () => {
  // const { data, isLoading, isError } = useQuery({
  //   queryKey: ["enter-code"],
  //   queryFn: async () => {
  //     const url = `${baseAPIUrl}/codes/release-code/`;
  //     const response = await fetch(url, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  //     return response.json();
  //   },
  // });

  // const handleComplete = (code: string) => {
  //   console.log(`Code entered: ${code}`);
  //   // You can handle the code submission logic here
  // };

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // if (isError) {
  //   return <div>Error loading data</div>;
  // }

  return (
    <div className="flex w-full flex-col items-center justify-center gap-40">
      <div>
        <h1 className="page-header">Input your code</h1>
      </div>
      <div>
        <Input
          type="number"
          autoFocus
          className="h-32 w-[500px] border text-center !text-8xl [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          inputMode="numeric"
          pattern="[0-9]*"
        />
        <Button className="btn-cta btn-ter w-[500px]">Use my ID instead</Button>
      </div>
    </div>
  );
};

export default CodeEntryPage;
