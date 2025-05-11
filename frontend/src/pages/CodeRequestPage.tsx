import { useQuery } from "@tanstack/react-query";
import { codesAPIUrl } from "@/constants";

import { Button } from "@/components/ui/button";
import { useState } from "react";

const CodeRequestPage = () => {
  const [code, setCode] = useState<string>("--");

  const handleCodeRequest = async () => {
    const response = await fetch(`${codesAPIUrl}/random-code`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      setCode(data.random_code);
    } else {
      console.error("Error requesting code:", response.statusText);
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-20">
      <div>
        <h1 className="text-4xl">Request a code</h1>
      </div>
      <div className="flex h-64 w-64 items-center justify-center rounded-xl border-8 text-9xl">
        {code}
      </div>
      <Button className="h-16 w-64 p-4 text-xl" onClick={handleCodeRequest}>
        Request code
      </Button>
    </div>
  );
};

export default CodeRequestPage;
