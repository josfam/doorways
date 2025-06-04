// import { useQuery } from "@tanstack/react-query";
// import { baseAPIUrl } from "@/constants";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { inputResetDelay } from "@/constants";
import { codesAPIUrl } from "@/constants";
import { toast } from "react-toastify";
import { toastDuration } from "@/constants";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";

const CodeEntryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
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

  const sendCode = async (
    code: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    console.log(`Code entered: ${code}`);
    // send the code to the server with a useQuery from tanstack
    const url = `${codesAPIUrl}/release-code/${code}`;
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          toast.error("Invalid code", {
            autoClose: toastDuration,
            closeOnClick: true,
          });
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        toast.success("Code processed!", {
          autoClose: toastDuration,
          closeOnClick: true,
        });
        console.log("Code sent successfully:", data);
      })
      .catch((error) => {
        console.error("Error sending code:", error);
      });
    // create a small one second delay before clearing the input
    setTimeout(() => {
      e.target.value = "";
    }, inputResetDelay);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    navigate("/", {
      state: { showSuccessToast: true },
      replace: true,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length == 2) {
      e.target.value = value.slice(0, 2); // Limit input to 2 characters
      sendCode(value, e); // Send the code when it reaches 2 characters
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-40">
      <div>
        <h1 className="page-header">Input your code</h1>
      </div>
      <div>
        <Input
          type="number"
          maxLength={2}
          onChange={handleChange}
          autoFocus
          className="h-32 w-[500px] border-4 border-sky-600 text-center !text-8xl text-sky-900 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          inputMode="numeric"
          pattern="[0-9]*"
        />
        <div className="mt-8 flex flex-col items-center justify-center gap-4">
          <Button className="btn-cta btn-ter border-1 w-[500px] border-amber-500">
            Use my ID instead
          </Button>
          <Button onClick={handleLogout} className="btn-ter btn-ter w-[500px]">
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CodeEntryPage;
