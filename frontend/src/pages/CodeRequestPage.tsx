import {
  codesAPIUrl,
  codeExpirationTime,
  expirationCountdownInterval,
} from "@/constants";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const CodeRequestPage = () => {
  const [code, setCode] = useState<string>("--");
  const [expirationTime, setExpirationTime] =
    useState<number>(codeExpirationTime);
  const [timeLeft, setTimeLeft] = useState<number>(expirationTime);
  const [codeWasRequested, setCodeWasRequested] = useState<boolean>(false);

  // Timer for a countdown for expiration of the requested code
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!codeWasRequested) return;

    if (timeLeft >= 0) {
      timer = setTimeout(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setCode("--");
            setCodeWasRequested(false);
            return codeExpirationTime;
          }
          return prevTime - 1;
        });
      }, expirationCountdownInterval);
    }

    // cleanup for the running timer
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [codeWasRequested, timeLeft]);

  const handleCodeRequest = async () => {
    const response = await fetch(`${codesAPIUrl}/random-code`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      setExpirationTime(data.expiration_time);
      setCode(data.random_code);
      setCodeWasRequested(true);
    } else {
      console.error("Error requesting code:", response.statusText);
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-20">
      <div>
        <h1 className="text-4xl">Request a code</h1>
      </div>
      <div className="flex flex-col">
        {/* container for countdown timer */}
        <div className="absolute mr-[-30px] mt-[-30px] flex h-20 w-20 items-center justify-center self-end rounded-full bg-emerald-400 text-center text-5xl font-bold text-emerald-900">
          {codeWasRequested ? timeLeft : "--"}
        </div>
        <div className="flex h-64 w-64 items-center justify-center rounded-xl border-8 text-9xl">
          {code}
        </div>
      </div>
      <Button
        className={`h-16 w-64 p-4 text-xl ${codeWasRequested ? "bg-slate-400" : "opacity-100"}`}
        onClick={handleCodeRequest}
        disabled={codeWasRequested}
      >
        Request code
      </Button>
    </div>
  );
};

export default CodeRequestPage;
