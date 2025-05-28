import { Outlet } from "react-router-dom";

// Container layout that wraps most pages
const MainLayout = () => {
  return (
    <main className="flex h-full w-full flex-col items-center justify-center bg-amber-50 p-4">
      <Outlet />
    </main>
  );
};

export default MainLayout;
