import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin-sidebar";

// Container layout that wraps all admin pages
const SysAdminLayout = () => {
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
      <section className="flex w-full flex-col items-center gap-6 p-4 sm:p-12">
        <Outlet />
      </section>
    </main>
  );
};

export default SysAdminLayout;
