import { Outlet } from "react-router-dom";

// Container layout that wraps all admin pages
const AdminLayout = () => {
  return (
    <main className="flex h-full w-full flex-col items-center justify-center">
      <Outlet />
    </main>
  );
};

export default AdminLayout;
