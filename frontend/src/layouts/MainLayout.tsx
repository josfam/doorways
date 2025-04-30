import { Outlet } from "react-router-dom";

// Container layout that wraps all admin pages
const MainLayout = () => {
  return (
    <main className="flex h-full w-full flex-col items-center">
      <Outlet />
    </main>
  );
};

export default MainLayout;
