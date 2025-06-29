import React, { ReactNode } from "react";

interface UserListContainerProps {
  children: ReactNode;
}

export const UserListContainer: React.FC<UserListContainerProps> = ({
  children,
}) => {
  return (
    <div className="flex max-h-[1000px] min-h-[300px] flex-col items-center justify-center overflow-y-auto rounded-md border-2 border-amber-200 bg-white p-10">
      {children}
    </div>
  );
};
