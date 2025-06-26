import { ArrowDownToDot, ArrowUpFromDot, ChevronsDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
interface TransitionHistoryProps {
  transitionDate: string;
  transitionTime: string;
  transitionType: string;
}

const SingleTransitionDetail = ({
  transitionData,
}: {
  transitionData: TransitionHistoryProps;
}) => {
  const isEntry = transitionData.transitionType === "entry";
  return (
    <div
      className={`flex h-20 w-full items-center justify-between rounded-lg p-8 text-xl sm:min-w-[350px] sm:max-w-[400px] ${isEntry ? "border border-green-500 bg-green-100" : "border border-amber-500 bg-amber-100"}`}
    >
      <div>{transitionData.transitionDate}</div>
      <div>{transitionData.transitionTime}</div>
      <div
        className={`flex w-[110px] items-center justify-start gap-2 p-2 ${isEntry ? "bg-green-200" : "bg-amber-200"} rounded-lg`}
      >
        {isEntry ? (
          <ArrowDownToDot className="h-8 w-8 text-green-800" />
        ) : (
          <ArrowUpFromDot className="h-8 w-8 text-amber-600" />
        )}
        {/* Render transition type if not on mobile */}
        {!useIsMobile() && (
          <div className={`${isEntry ? "text-green-900" : "text-amber-900"}`}>
            {transitionData.transitionType}
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleTransitionDetail;
