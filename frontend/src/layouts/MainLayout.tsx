import { Outlet } from "react-router-dom";
import { Footer } from "@/components/footer";
// Container layout that wraps most pages
const MainLayout = () => {
  return (
    <main className="mb-48 flex h-max w-full flex-col items-center justify-center p-4 pt-20 sm:h-full sm:pt-0">
      <Outlet />
      <Footer />
    </main>
  );
};

export default MainLayout;
