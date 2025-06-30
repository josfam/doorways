import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserRequesterSidebar } from "@/components/user-requester-sidebar";

// Container layout that wraps all admin pages
const UserRequesterLayout = () => {
  return (
    <main className="user-requester-layout flex h-max bg-white">
      {/* user requester sidebar */}
      <div>
        <SidebarProvider>
          <UserRequesterSidebar />
          <SidebarTrigger />
        </SidebarProvider>
      </div>
      {/* main content area */}
      <section className="relative flex h-max w-full flex-col items-center gap-6 px-4 pt-12 sm:px-8 sm:pt-14">
        <Outlet />
        <footer className="fixed bottom-0 flex h-16 w-full items-center justify-center rounded-t-lg bg-slate-200">
          <p className="text-lg text-slate-700">Copyright 2025</p>
        </footer>
      </section>
    </main>
  );
};

export default UserRequesterLayout;
