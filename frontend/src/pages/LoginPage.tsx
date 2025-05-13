import { useForm } from "@tanstack/react-form";
import { z } from "zod"; // form validation
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

const LoginPage = () => {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: loginFormSchema, // validate with zod schema on change
    },
    onSubmit: ({ value }) => {
      alert(JSON.stringify(value, null, 2));
    },
  });

  return (
    <div className="flex h-fit w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-slate-200 bg-slate-50 px-6 pb-12 pt-5 shadow-lg sm:w-3/4 sm:px-20 lg:w-1/2">
      <div className="flex w-full flex-col">
        <h1 className="py-2 text-xl font-bold text-slate-600">Login</h1>
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
          Submit
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
