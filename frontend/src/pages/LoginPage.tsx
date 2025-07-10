import { useForm } from "@tanstack/react-form";
import { z } from "zod"; // form validation
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { authAPIUrl } from "@/constants";
import { toast } from "react-toastify";
import { toastDuration } from "@/constants";
import { useNavigate, useLocation } from "react-router-dom";
import { useRef, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { role_names } from "@/constants";
import type { JwtPayload } from "@/types/types";
import { routeUrl } from "@/routing";

const loginFormSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .regex(/.*cavendish\.ac\.ug$/, {
      message: "Must be a Cavendish email",
    })
    .email(),
  password: z.string().nonempty("Password is required"),
});

// API calling function with tanstack
const useLogin = () => {
  return useMutation({
    mutationFn: async (value: z.infer<typeof loginFormSchema>) => {
      const response = await fetch(`${authAPIUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      });
      const data = await response.json();
      if (response.status !== 200) {
        throw new Error(data.message);
      }
      return data;
    },
  });
};

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toastShown = useRef(false); // prevent re-rendering twice

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: loginFormSchema, // validate with zod schema on change
    },
    onSubmit: ({ value }) => {
      handleLogin(value);
    },
  });

  // Showing success toast after logout
  useEffect(() => {
    if (location.state?.showSuccessToast && !toastShown.current) {
      toast.success("Logout successful", {
        autoClose: toastDuration,
        closeOnClick: true,
        pauseOnFocusLoss: false,
      });
      toastShown.current = true; // set to true to prevent re-rendering
    }
  }, [location.state]);

  const loginMutation = useLogin();
  const handleLogin = (value: z.infer<typeof loginFormSchema>) => {
    loginMutation.mutate(value, {
      onSuccess: (data) => {
        // store token in local storage
        const token = data.jwt_token;
        localStorage.setItem("jwt_token", token);
        // redirect to the proper page based on role
        const role_name = jwtDecode<JwtPayload>(token).role_name;
        if (
          role_name === role_names.student ||
          role_name === role_names.lecturer
        ) {
          navigate(`${routeUrl.absolutes.userCodeRequest}`, {
            state: { showSuccessToast: true },
            replace: true,
          });
        } else if (role_name === role_names["sys admin"]) {
          navigate(`${routeUrl.absolutes.sysAdminViewUsers}`, {
            state: { showSuccessToast: true },
            replace: true,
          });
        } else {
          navigate(`${routeUrl.codeInput}`, {
            state: { showSuccessToast: true },
            replace: true,
          });
        }
      },
      onError: (error) => {
        toast.error(error.message, {
          autoClose: toastDuration,
          closeOnClick: true,
        });
        // toast.error(error.message);
      },
    });
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-center gap-2">
        <img
          className="w-[50px] sm:w-[100px]"
          src="/doorways-logo.svg"
          alt=""
        />
        <div>
          <h1 className="text-2xl leading-3 tracking-[1.5px] text-green-600 sm:text-3xl sm:leading-none">
            door
          </h1>
          <h1 className="text-2xl text-amber-600 sm:text-3xl">ways</h1>
        </div>
      </div>
      <div className="z-10 flex h-fit w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-slate-200 bg-slate-50 px-6 pb-12 pt-5 shadow-lg sm:w-3/4 sm:px-20 lg:w-1/2">
        <div className="flex w-full flex-col">
          <h2 className="py-2 text-xl font-bold text-slate-600">Login</h2>
          <div className="h-[2px] w-full bg-slate-200"></div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="mt-4 flex w-full flex-col gap-4"
        >
          <form.Field name="email">
            {(field) => (
              <div className="flex w-full flex-col items-start justify-start gap-1">
                <label htmlFor="email" className="text-lg">
                  Email
                </label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-input`}
                  placeholder="Your Cavendish email address"
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={
                    field.state.meta.errors.length > 0 &&
                    field.state.meta.isTouched
                  }
                />
                {field.state.meta.errors.length > 0 &&
                field.state.meta.isTouched ? (
                  <div className="text-sm text-destructive">
                    {field.state.meta.errors
                      .map((error) => error?.message)
                      .join(", ")}
                  </div>
                ) : null}
              </div>
            )}
          </form.Field>
          <form.Field name="password">
            {(field) => (
              <div className="flex w-full flex-col items-start justify-start gap-1">
                <label htmlFor="password" className="text-lg">
                  Password
                </label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  className={`form-input`}
                  placeholder="Your password"
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={
                    field.state.meta.errors.length > 0 &&
                    field.state.meta.isTouched
                  }
                />
                {field.state.meta.errors.length > 0 &&
                field.state.meta.isTouched ? (
                  <div className="text-sm text-destructive">
                    {field.state.meta.errors
                      .map((error) => error?.message)
                      .join(", ")}
                  </div>
                ) : null}
              </div>
            )}
          </form.Field>
          <Button type="submit" className="btn-cta">
            Login
          </Button>
        </form>
      </div>
      <div className="decorative-bg absolute bottom-0 h-1/2 w-full rounded-lg bg-amber-100"></div>
    </>
  );
};

export default LoginPage;
