import { Input } from "../ui/input";
import { FileUp, MoveRight, LoaderCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { useState } from "react";
import { toast } from "react-toastify";
import { toastDuration } from "@/constants";
import { sysAdminAPIUrl } from "@/constants";
import { UserDetailsArray } from "@/types/types";
import Papa from "papaparse";
import { useMutation } from "@tanstack/react-query";

interface UserFileUploaderProps {
  userType:
    | "students"
    | "lecturers"
    | "security-guards"
    | "sys-admins"
    | "admins";
  formatInstructions: React.ReactNode;
}

export const UserFileUploader = ({
  userType,
  formatInstructions,
}: UserFileUploaderProps) => {
  const [fileName, setFileName] = useState<string>("");
  const [CSVFile, setCSVFile] = useState<File | null>(null);

  // upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (studentDetails: UserDetailsArray) => {
      const url = `${sysAdminAPIUrl}/upload/${userType}`;
      const result = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentDetails),
      });
      if (!result.ok) {
        throw new Error("Upload failed. Try again.");
      }
      return await result.json();
    },
    onSuccess: () => {
      toast.success(`${userType} upload successful!`, {
        autoClose: toastDuration,
        closeOnClick: true,
        pauseOnFocusLoss: false,
      });
    },
    onError: () => {
      toast.error(`${userType} upload failed! Try again`, {
        autoClose: toastDuration,
        closeOnClick: true,
        pauseOnFocusLoss: false,
      });
    },
  });

  const parseUploadedFile = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        uploadMutation.mutate(results.data as UserDetailsArray);
      },
    });
  };

  return (
    <div className="min-w-400px] relative flex h-max w-full flex-col sm:w-full">
      <div className="group relative z-10 flex flex-col items-center justify-center gap-4 rounded-b-none rounded-t-lg border border-dashed border-sky-300 bg-amber-50 p-4 hover:bg-amber-100 active:bg-amber-300">
        <h2 className="-mt-2 self-start text-xl text-sky-600 group-hover:text-sky-400 group-active:text-sky-400">
          {`${userType}`}
        </h2>
        <Popover>
          <PopoverTrigger asChild className="absolute right-0 top-0">
            <Button className="z-20 ml-2 h-max cursor-pointer rounded-br-none rounded-tl-none border-none border-slate-600 bg-amber-100 px-4 py-2 text-lg text-sky-600 shadow-none hover:scale-105 hover:bg-amber-100 hover:text-sky-800 hover:shadow-lg focus:outline-none active:bg-amber-300">
              .csv format ?
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-fit border border-sky-200 bg-amber-50 p-4 shadow-lg">
            <span className="p-4 text-sky-700">
              The {userType} .csv file should have these columns:
            </span>
            {formatInstructions}
          </PopoverContent>
        </Popover>
        <Input
          type="file"
          accept=".csv"
          className="absolute flex h-full flex-col items-center justify-center rounded-xl border p-4 opacity-0"
          onChange={(e) => {
            // set the file name and file object
            if (e.target.files && e.target.files.length > 0) {
              setFileName(e.target.files[0].name);
              setCSVFile(e.target.files ? e.target.files[0] : null);
            }
          }}
        />
        <FileUp
          className={`mt-4 h-24 w-24 text-sky-200 group-hover:text-sky-300 group-active:text-sky-400 ${fileName ? "text-sky-400" : ""}`}
        />
        <div
          className={`-mt-5 flex h-12 w-full items-center justify-center text-ellipsis rounded-lg bg-transparent text-xl font-semibold text-sky-400 ${fileName ? "" : "hidden"}`}
        >
          {fileName}
        </div>
      </div>
      <Button
        className="border-1 group flex h-16 items-center justify-center text-nowrap rounded-t-none rounded-bl-lg rounded-br-lg border-sky-300 bg-sky-100 text-xl text-sky-600 opacity-100 hover:bg-sky-700 hover:text-white active:bg-sky-800"
        disabled={uploadMutation.isPending || !fileName}
        onClick={() => {
          parseUploadedFile(CSVFile as File);
        }}
      >
        {uploadMutation.isPending ? (
          <div className="flex w-full items-center justify-center">
            <LoaderCircle className="m-0 !h-7 !w-7 animate-spin" />
            <p>{`Uploading...`}</p>
          </div>
        ) : (
          <>
            <h2 className="text-lg group-hover:font-semibold">Upload file</h2>
            <MoveRight className="duration-400 !h-6 !w-6 transition-all ease-in-out group-hover:-rotate-90" />
          </>
        )}
      </Button>
    </div>
  );
};
