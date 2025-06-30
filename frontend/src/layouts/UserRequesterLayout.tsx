import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserRequesterSidebar } from "@/components/user-requester-sidebar";
import { Footer } from "@/components/footer";

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
        <Footer />
      </section>
    </main>
  );
};

export default UserRequesterLayout;
