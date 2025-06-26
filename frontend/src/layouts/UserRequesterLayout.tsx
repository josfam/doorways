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
      <section className="flex h-max w-full flex-col items-center gap-6 p-4 sm:p-12">
        <Outlet />
      </section>
    </main>
  );
};

export default UserRequesterLayout;
