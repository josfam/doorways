import { Outlet } from "react-router-dom";
import { Footer } from "@/components/footer";
// Container layout that wraps most pages
const MainLayout = () => {
  return (
    <main className="0 mb-48 flex h-max w-full flex-col items-center justify-center p-4 sm:h-full">
      <Outlet />
      <Footer />
    </main>
  );
};

export default MainLayout;
