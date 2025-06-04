import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin-sidebar";

// Container layout that wraps all admin pages
const AdminLayout = () => {
  return (
    <main className="admin-layout flex h-dvh">
      {/* admin sidebar */}
      <div>
        <SidebarProvider>
          <AdminSidebar />
          <SidebarTrigger />
        </SidebarProvider>
      </div>
      {/* main content area */}
      <section className="flex w-full flex-col items-center justify-center">
        <Outlet />
      </section>
    </main>
  );
};

export default AdminLayout;
