import { useQuery } from "@tanstack/react-query";
import { baseAPIUrl } from "@/constants";

import { Button } from "@/components/ui/button";

const CodeRequestPage = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-20">
      <div>
        <h1 className="text-4xl">Request a code</h1>
      </div>
      <div className="flex h-64 w-64 items-center justify-center rounded-xl border-8 text-9xl">
        99
      </div>
      <Button className="h-16 w-64 p-4 text-xl">Request code</Button>
    </div>
  );
};

export default CodeRequestPage;
