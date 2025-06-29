import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import "./style.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MainLayout from "./layouts/MainLayout";
import UserRequesterLayout from "./layouts/UserRequesterLayout";
import CodeEntryPage from "./pages/CodeEntryPage";
import CodeRequestPage from "./pages/CodeRequestPage";
import UserActivityHistoryPage from "./pages/UserActivityHistoryPage";
import LoginPage from "./pages/LoginPage";
import { ToastContainer } from "react-toastify";
import SysAdminLayout from "./layouts/SysAdminLayout";
import { SysAdminUserViewPage } from "./pages/SysAdminUserViewPage";
import { SysAdminUserAddPage } from "./pages/SysAdminUserAddPage";
import { routeUrl } from "./routing";

// tanstack react-query client
const queryClient = new QueryClient();

function App() {
  return (
    <>
      <ToastContainer />
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<LoginPage />} />
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
            <Route path={routeUrl.user.root} element={<UserRequesterLayout />}>
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
                path={routeUrl.user.codeInput}
                element={<CodeEntryPage />}
              />
            </Route>
          </Routes>
        </Router>
      </QueryClientProvider>
    </>
  );
}

export default App;
