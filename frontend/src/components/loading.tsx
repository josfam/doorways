import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "spinner" | "dots" | "pulse";
  text?: string;
  className?: string;
}

export const Loading = ({
  size = "md",
  variant = "spinner",
  text,
  className,
}: LoadingProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  if (variant === "spinner") {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2",
          className,
        )}
      >
        <div
          className={cn(
            "animate-spin rounded-full border-2 border-gray-300 border-t-primary",
            sizeClasses[size],
          )}
        />
        {text && (
          <p className={cn("text-muted-foreground", textSizeClasses[size])}>
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2",
          className,
        )}
      >
        <div className="flex space-x-1">
          <div
            className={cn(
              "animate-bounce rounded-full bg-primary",
              sizeClasses[size],
            )}
            style={{ animationDelay: "0ms" }}
          />
          <div
            className={cn(
              "animate-bounce rounded-full bg-primary",
              sizeClasses[size],
            )}
            style={{ animationDelay: "150ms" }}
          />
          <div
            className={cn(
              "animate-bounce rounded-full bg-primary",
              sizeClasses[size],
            )}
            style={{ animationDelay: "300ms" }}
          />
        </div>
        {text && (
          <p className={cn("text-muted-foreground", textSizeClasses[size])}>
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2",
          className,
        )}
      >
        <div
          className={cn(
            "animate-pulse rounded-full bg-primary",
            sizeClasses[size],
          )}
        />
        {text && (
          <p
            className={cn(
              "animate-pulse text-muted-foreground",
              textSizeClasses[size],
            )}
          >
            {text}
          </p>
        )}
      </div>
    );
  }

  return null;
};

// Skeleton loading component for lists/cards
export const LoadingSkeleton = ({
  rows = 3,
  className,
}: {
  rows?: number;
  className?: string;
}) => {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-full bg-gray-300"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-gray-300"></div>
              <div className="h-3 w-1/2 rounded bg-gray-300"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Full page loading component
export const PageLoading = ({ text = "Loading..." }: { text?: string }) => {
  return (
    <div className="flex min-h-[400px] w-full flex-col items-center justify-center">
      <Loading size="lg" text={text} />
    </div>
  );
};
