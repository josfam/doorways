import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin-sidebar";
import { Footer } from "@/components/footer";

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
      <section className="relative mb-48 flex h-max w-full flex-col items-center gap-6 px-4 pt-12 sm:px-8 sm:pt-14">
        <Outlet />
        <Footer />
      </section>
    </main>
  );
};

export default SysAdminLayout;
