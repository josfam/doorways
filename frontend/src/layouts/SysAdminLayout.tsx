import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin-sidebar";

// Container layout that wraps all admin pages
const SysAdminLayout = () => {
  return (
    <main className="sys-admin-layout flex h-max bg-white">
      {/* admin sidebar */}
      <div>
        <SidebarProvider>
          <AdminSidebar />
          <SidebarTrigger />
        </SidebarProvider>
      </div>
      {/* main content area */}
      <section className="flex h-max w-full flex-col items-center gap-6 px-4 pt-12 sm:px-8 sm:pt-14">
        <Outlet />
      </section>
    </main>
  );
};

export default SysAdminLayout;
