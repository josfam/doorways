import { Input } from "../ui/input";
import { FileUp, MoveRight } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { useState } from "react";
import { sysAdminAPIUrl } from "@/constants";
import { UserDetailsArray } from "@/types/types";
import Papa from "papaparse";

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

  const parseUploadedFile = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // console.log("Parsed Results:", typeof(results.data));
        uploadCSVFile(results.data as UserDetailsArray);
      },
    });
  };

  const uploadCSVFile = async (studentDetails: UserDetailsArray) => {
    const url = `${sysAdminAPIUrl}/upload/${userType}`;
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(studentDetails),
    });
  };

  return (
    <div className="min-w-400px] relative flex h-max w-full flex-col sm:w-full">
      <div className="group relative z-10 flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-sky-300 bg-amber-50 p-4 hover:bg-amber-100 active:bg-amber-300">
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
        className="border-1 group mt-[-15px] flex h-16 items-center justify-center text-nowrap rounded-bl-lg rounded-br-lg border-sky-300 bg-sky-100 text-xl text-sky-600 opacity-100 hover:bg-sky-700 hover:text-white active:bg-sky-800"
        disabled={!fileName}
        onClick={() => {
          parseUploadedFile(CSVFile as File);
        }}
      >
        <h2 className="mt-3 text-lg group-hover:font-semibold">Upload file</h2>
        <MoveRight className="duration-400 mt-3 !h-6 !w-6 transition-all ease-in-out group-hover:-rotate-90" />
      </Button>
    </div>
  );
};
