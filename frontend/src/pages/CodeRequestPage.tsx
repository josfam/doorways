import {
  codesAPIUrl,
  defaultCodeExpirationTime,
  expirationCountdownInterval,
  baseWebSocketUrl,
} from "@/constants";

import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { toastDuration, checkMarksDuration } from "@/constants";
import { useConfig } from "@/hooks/useConfig";

const CodeRequestPage = () => {
  // get code expiration from server
  const codeExpirationTime =
    useConfig().data?.code_expiration_time || defaultCodeExpirationTime;
  const [code, setCode] = useState<string>("--");
  const [expirationTime, setExpirationTime] =
    useState<number>(codeExpirationTime);
  const [timeLeft, setTimeLeft] = useState<number>(expirationTime);
  const [codeWasRequested, setCodeWasRequested] = useState<boolean>(false);
  const [showCheckmark, setShowCheckmark] = useState<boolean>(false);
  const location = useLocation();
  // const navigate = useNavigate();
  const toastShown = useRef(false); // prevent re-rendering twice

  // Showing success toast after login
  useEffect(() => {
    if (location.state?.showSuccessToast && !toastShown.current) {
      toast.success("Login successful", {
        autoClose: toastDuration,
        closeOnClick: true,
        pauseOnFocusLoss: false,
      });
      toastShown.current = true; // set to true to prevent re-rendering
    }
  }, [location.state]);

  // Reset code and times
  const resetScreen = useCallback(() => {
    setCode("--");
    setExpirationTime(codeExpirationTime);
    setCodeWasRequested(false);
    setTimeLeft(expirationTime);
  }, [codeExpirationTime, expirationTime]);

  // Notification when code has been accepted after entry on the guard's system
  useEffect(() => {
    if (code === "--" || !codeWasRequested) return;
    const ws = new WebSocket(`${baseWebSocketUrl}/codes/ws/${code}`);
    ws.onmessage = (event) => {
      toast.success(event.data, {
        autoClose: toastDuration,
        closeOnClick: true,
      });
      setShowCheckmark(true);
      setTimeout(() => {
        setShowCheckmark(false);
      }, checkMarksDuration); // Hide checkmark after a delay
      // Reset the screen
      resetScreen();
    };
    return () => ws.close();
  }, [code, codeWasRequested, resetScreen]);

  // Timer for a countdown for expiration of the requested code
  useEffect(() => {
    if (!codeWasRequested) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up! Stop the timer and reset
          setCode("--");
          setCodeWasRequested(false);
          return codeExpirationTime; // Reset for next use
        }
        return prev - 1; // Continue countdown
      });
    }, expirationCountdownInterval);

    // cleanup for the running timer
    return () => {
      clearInterval(timer);
    };
  }, [codeWasRequested, codeExpirationTime]);

  const handleCodeRequest = async () => {
    const response = await fetch(`${codesAPIUrl}/random-code`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
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
        <h1 className="page-header">Request a code</h1>
      </div>
      <div>
        <div className="flex flex-col">
          {/* container for countdown timer */}
          <div className="absolute mr-[-30px] mt-[-30px] flex h-20 w-20 items-center justify-center self-end rounded-full bg-emerald-400 text-center text-5xl font-bold text-emerald-900">
            {codeWasRequested ? timeLeft : "--"}
          </div>
          <div className="flex h-64 w-64 items-center justify-center rounded-xl border-8 text-9xl">
            {showCheckmark ? <span>✔️</span> : code}
          </div>
        </div>
        <div className="flex flex-col">
          <Button
            className={`btn-cta w-64 ${codeWasRequested ? "bg-slate-400" : "opacity-100"}`}
            onClick={handleCodeRequest}
            disabled={codeWasRequested}
          >
            Request code
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CodeRequestPage;
