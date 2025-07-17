import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import "./style.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MainLayout from "./layouts/MainLayout";
import UserRequesterLayout from "./layouts/UserRequesterLayout";
import { ToastContainer } from "react-toastify";
import SysAdminLayout from "./layouts/SysAdminLayout";
import { routeUrl } from "./routing";
import { lazy, Suspense } from "react";
import { Loading } from "./components/loading";

// fonts
import "@fontsource/open-sauce-sans/300.css";
import "@fontsource/open-sauce-sans/400.css";
import "@fontsource/open-sauce-sans/500.css";
import "@fontsource/open-sauce-sans/600.css";

// lazy load pages (chunk)
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SysAdminUserViewPage = lazy(() => import("./pages/SysAdminUserViewPage"));
const SysAdminUserAddPage = lazy(() => import("./pages/SysAdminUserAddPage"));
const CodeEntryPage = lazy(() => import("./pages/CodeEntryPage"));
const CodeRequestPage = lazy(() => import("./pages/CodeRequestPage"));
const UserActivityHistoryPage = lazy(
  () => import("./pages/UserActivityHistoryPage"),
);
const UserProfilePage = lazy(() => import("./pages/UserProfilePage"));

// tanstack react-query client
const queryClient = new QueryClient();

function App() {
  return (
    <>
      <ToastContainer />
      <QueryClientProvider client={queryClient}>
        <Router>
          <Suspense
            fallback={
              <div className="flex h-full w-full items-center justify-center bg-amber-100">
                <Loading
                  className="text-amber-600"
                  size="xl"
                  text="Loading page..."
                />
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<LoginPage />} />
                <Route path={routeUrl.codeInput} element={<CodeEntryPage />} />
              </Route>
              <Route path={routeUrl.sysAdmin.root} element={<SysAdminLayout />}>
                <Route index element={<SysAdminUserViewPage />} />
                <Route
                  path={routeUrl.sysAdmin.viewUsers}
                  element={<SysAdminUserViewPage />}
                />
                <Route
                  path={routeUrl.sysAdmin.addUsers}
                  element={<SysAdminUserAddPage />}
                />
              </Route>
              <Route
                path={routeUrl.user.root}
                element={<UserRequesterLayout />}
              >
                <Route index element={<CodeRequestPage />} />
                <Route
                  path={routeUrl.user.codeRequest}
                  element={<CodeRequestPage />}
                />
                <Route
                  path={routeUrl.user.activityHistory}
                  element={<UserActivityHistoryPage />}
                />
                <Route
                  path={routeUrl.user.profile}
                  element={<UserProfilePage />}
                />
              </Route>
            </Routes>
          </Suspense>
        </Router>
      </QueryClientProvider>
    </>
  );
}

export default App;
