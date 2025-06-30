import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../ui/dialog";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { role_names, sysAdminAPIUrl } from "@/constants";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { UserDetails } from "@/types/types";
import { useRef, useState } from "react";
interface UserUpdateDialogProps {
  userData: UserDetails;
  role: string;
}

// Alternative: Dynamic schema based on role
const userUpdateSchema = (role: string) => {
  const baseSchema = z.object({
    "user id": z.string().min(1, "User ID is required"),
    email: z.string().min(1, "Email is required"),
    surname: z.string().min(1, "Surname is required"),
    "given name": z.string().min(1, "Given name is required"),
    "phone number": z.string().min(1, "Phone number is required"),
    "role name": z.string().min(1, "Role name is required"),
  });

  // role-specific validations
  if (role === role_names.student) {
    return baseSchema.extend({
      "course name": z.string().min(1, "Course name is required"),
    });
  }

  if (role === role_names.lecturer) {
    return baseSchema.extend({
      "faculty name": z.string().min(1, "Faculty name is required"),
    });
  }

  if (role === role_names.security) {
    return baseSchema.extend({
      "security company": z.string().min(1, "Security company is required"),
    });
  }

  return baseSchema;
};

// Information change mutation API call
// Create a type for user update data
type UserUpdateData = z.infer<ReturnType<typeof userUpdateSchema>>;

const useUpdateInfoMutation = () => {
  return useMutation({
    mutationFn: async (value: UserUpdateData) => {
      console.log("Making API call"); // DEBUG
      console.log(`${JSON.stringify(value)}`); // DEBUG
      const url = `${sysAdminAPIUrl}/user/${value["user id"]}`;
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      return data;
    },
  });
};

const useDeleteUserMutation = () => {
  return useMutation({
    mutationFn: async (value: UserUpdateData) => {
      console.log("deleting user"); // DEBUG
      const url = `${sysAdminAPIUrl}/user/${value["user id"]}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      return data;
    },
  });
};

const UserUpdateDialog = ({ userData, role }: UserUpdateDialogProps) => {
  const actionRef = useRef("update"); // tracks possible action on the form
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const updateMutation = useUpdateInfoMutation();
  const deleteMutation = useDeleteUserMutation();

  const invalidateQueryCache = () => {
    queryClient.invalidateQueries({ queryKey: ["allStudents"] });
    queryClient.invalidateQueries({ queryKey: ["allLecturers"] });
    queryClient.invalidateQueries({ queryKey: ["allSecurityGuards"] });
  };

  const handleInfoUpdate = (value) => {
    updateMutation.mutate(value, {
      onSuccess: () => {
        // invalidate the user list query to refresh the data
        invalidateQueryCache();
      },
    });
  };

  const handleUserDelete = (value) => {
    deleteMutation.mutate(value, {
      onSuccess: () => {
        // invalidate the user list query to refresh the data
        invalidateQueryCache();
      },
    });
  };

  const form = useForm({
    // defaultValues
    defaultValues: {
      "user id": userData.id,
      email: userData.email,
      surname: userData.surname,
      "given name": userData["given name"],
      "phone number": userData["phone number"],
      // only for students
      ...(role === role_names.student &&
        "course name" in userData && {
          "course name": userData["course name"],
        }),
      // only for lecturers
      ...(role === role_names.lecturer &&
        "faculty name" in userData && {
          "faculty name": userData["faculty name"],
        }),
      // only for security guards
      ...(role === role_names.security &&
        "security company" in userData && {
          "security company": userData["security company"],
        }),
      "role name": userData["role name"],
    },
    validators: {
      onChange: userUpdateSchema(role), // validate with zod schema on change
    },
    onSubmit: ({ value }) => {
      if (actionRef.current === "update") {
        handleInfoUpdate(value);
      } else if (actionRef.current === "delete") {
        // this is a delete
        setShowConfirmation(true);
        // handleUserDelete(value);
      }
    },
  });

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button className="w-30 ml-auto bg-sky-600 p-5 text-lg hover:bg-sky-800 active:bg-sky-900">
          Update
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-amber-50 sm:max-w-[600px]">
        <DialogHeader className="mb-0 text-lg text-amber-900">
          <DialogTitle className="self-center">{`Edit ${role} profile`}</DialogTitle>
        </DialogHeader>
        <hr className="mb-4 mt-0 h-[2px] bg-amber-200" />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex flex-col gap-4"
        >
          {/* Common fields for all users */}
          <form.Field name="user id">
            {(field) => (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="user id" className="text-right text-lg">
                  Id
                </Label>
                <Input
                  id="user id"
                  className="col-span-3 bg-white !text-lg"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={
                    field.state.meta.errors.length > 0 &&
                    field.state.meta.isTouched
                  }
                  disabled
                />
              </div>
            )}
          </form.Field>

          <form.Field name="email">
            {(field) => (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right text-lg">
                  Email
                </Label>
                <Input
                  id="email"
                  className="col-span-3 bg-white !text-lg"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={
                    field.state.meta.errors.length > 0 &&
                    field.state.meta.isTouched
                  }
                  disabled
                />
              </div>
            )}
          </form.Field>

          <form.Field name="surname">
            {(field) => (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="surname" className="text-right text-lg">
                  Surname
                </Label>
                <Input
                  id="surname"
                  className="col-span-3 bg-white !text-lg"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={
                    field.state.meta.errors.length > 0 &&
                    field.state.meta.isTouched
                  }
                />
              </div>
            )}
          </form.Field>

          <form.Field name="given name">
            {(field) => (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="given-name" className="text-right text-lg">
                  Given Name
                </Label>
                <Input
                  id="given name"
                  className="col-span-3 bg-white !text-lg"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={
                    field.state.meta.errors.length > 0 &&
                    field.state.meta.isTouched
                  }
                />
              </div>
            )}
          </form.Field>

          <form.Field name="phone number">
            {(field) => (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone number" className="text-right text-lg">
                  Phone
                </Label>
                <Input
                  id="phone number"
                  className="col-span-3 bg-white !text-lg"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={
                    field.state.meta.errors.length > 0 &&
                    field.state.meta.isTouched
                  }
                />
              </div>
            )}
          </form.Field>

          {/* role-specific */}

          {role === role_names.student && (
            <form.Field name="course name">
              {(field) => (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="course-name" className="text-right text-lg">
                    Course Name
                  </Label>
                  <Input
                    id="course name"
                    className="col-span-3 bg-white !text-lg"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={
                      field.state.meta.errors.length > 0 &&
                      field.state.meta.isTouched
                    }
                    disabled
                  />
                </div>
              )}
            </form.Field>
          )}

          {role === role_names.lecturer && (
            <form.Field name="faculty name">
              {(field) => (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="faculty-name" className="text-right text-lg">
                    Faculty Name
                  </Label>
                  <Input
                    id="faculty name"
                    className="col-span-3 bg-white !text-lg"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={
                      field.state.meta.errors.length > 0 &&
                      field.state.meta.isTouched
                    }
                    disabled
                  />
                </div>
              )}
            </form.Field>
          )}

          {role === role_names.security && (
            <form.Field name="security company">
              {(field) => (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="security-company"
                    className="text-right text-lg"
                  >
                    Security Company
                  </Label>
                  <Input
                    id="security company"
                    className="col-span-3 bg-white !text-lg"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={
                      field.state.meta.errors.length > 0 &&
                      field.state.meta.isTouched
                    }
                    disabled
                  />
                </div>
              )}
            </form.Field>
          )}

          <DialogFooter className="flex items-center justify-center gap-1">
            <Button
              type="submit"
              className="btn-cta btn-ter !w-1/4"
              name="action"
              value="delete"
              onClick={() => (actionRef.current = "delete")}
            >
              Delete
            </Button>
            <Button
              type="submit"
              className="btn-cta !w-3/4"
              name="action"
              value="update"
              onClick={() => (actionRef.current = "update")}
            >
              Update
            </Button>
          </DialogFooter>
        </form>
        {showConfirmation && (
          <div className="absolute flex h-full w-full flex-col items-center justify-center gap-6 rounded-lg bg-slate-200 px-6 text-xl opacity-95">
            <div className="flex flex-col items-center justify-center gap-4">
              <p>You are about to delete</p>
              <p className="font-bold">{`${userData.surname} ${userData["given name"]}`}</p>
            </div>
            <div className="flex w-full flex-col">
              <Button
                className="btn-cta btn-ter"
                onClick={() => {
                  setShowConfirmation(false);
                }}
              >
                No, Cancel
              </Button>
              <Button
                className="btn-cta"
                onClick={() => {
                  handleUserDelete(form.state.values);
                  setShowConfirmation(false);
                  setDialogOpen(false); // close the original dialog box
                }}
              >
                Yes, Delete
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserUpdateDialog;
