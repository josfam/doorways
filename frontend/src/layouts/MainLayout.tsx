import { Outlet } from "react-router-dom";
import { Footer } from "@/components/footer";
// Container layout that wraps most pages
const MainLayout = () => {
  return (
    <main className="flex h-full mb-48 w-full flex-col items-center justify-center 0 p-4">
      <Outlet />
      <Footer />
    </main>
  );
};

export default MainLayout;
