import { CircleAlert } from "lucide-react";

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <div className="flex w-full items-center justify-between rounded-lg border-2 border-red-200 bg-red-100 p-6 sm:w-3/4 xl:w-1/2">
      <CircleAlert className="m-0 h-6 w-6 p-0 text-red-700" />
      <p className="text-xl text-red-700">{`${message}`}</p>
    </div>
  );
};

export default ErrorMessage;
