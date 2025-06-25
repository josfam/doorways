import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuItem,
} from "./ui/sidebar";
import { Button } from "./ui/button";
import { LogOut, CalendarClock, CircleDashed } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useLogout } from "@/hooks/use-logout";

const SideBarItems = [
  {
    title: "Request code",
    url: "/user/code-request",
    icon: CircleDashed,
  },
  {
    title: "My activity",
    url: "/user/activity-history",
    icon: CalendarClock,
  },
];

export const UserRequesterSidebar = () => {
  // const urlLocation = useLocation();
  const url = useLocation().pathname;
  const highlightBtn = (currentUrl: string) => {
    return url.includes(currentUrl);
  };
  const handleLogout = useLogout();

  return (
    <Sidebar className="">
      <SidebarContent className="bg-amber-50">
        <SidebarGroup className="relative">
          <SidebarGroupLabel className="mb-8 flex h-10 items-center justify-center text-xl text-amber-900">
            System Admin
          </SidebarGroupLabel>
          <SidebarGroupContent className="flex list-none flex-col gap-4 px-1">
            {SideBarItems.map((item) => {
              return (
                <SidebarMenuItem key={item.title}>
                  <Link
                    to={item.url}
                    className={`link-sidebar flex items-center justify-start gap-3 shadow-sm shadow-amber-300 ${highlightBtn(item.url) ? "border-2 border-sky-800 !bg-sky-600 !text-white" : ""}`}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuItem>
              );
            })}

            <SidebarMenuItem>
              <Button
                className={`btn-sidebar flex justify-start gap-3 ${highlightBtn("/logout") ? "border-1 border-sky-800 !bg-sky-600" : ""}`}
                onClick={handleLogout}
              >
                <LogOut className="!h-6 !w-6" />
                <span>{`Logout`}</span>
              </Button>
            </SidebarMenuItem>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
