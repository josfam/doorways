import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin-sidebar";
import githubLogo from "@/assets/icons/github.svg";

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
        <footer className="fixed bottom-0 flex h-16 w-full items-center justify-center rounded-t-lg bg-slate-200">
          <p className="flex items-center justify-center gap-6 text-lg text-slate-700">
            <a href="https://github.com/josfam/doorways" target="blank_">
              <img
                src={githubLogo}
                alt="github logo that links to the project github repository"
                className="h-8 w-8"
              />
            </a>
            Copyright 2025
          </p>
        </footer>
      </section>
    </main>
  );
};

export default SysAdminLayout;
