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
              <Route path="/code-input" element={<CodeEntryPage />} />
            </Route>
            <Route path="/sys-admin" element={<SysAdminLayout />}>
              <Route index element={<SysAdminUserViewPage />} />
              <Route path="view-users" element={<SysAdminUserViewPage />} />
              <Route path="add-users" element={<SysAdminUserAddPage />} />
            </Route>
            <Route path="/user" element={<UserRequesterLayout />}>
              <Route index element={<CodeRequestPage />} />
              <Route path="code-request" element={<CodeRequestPage />} />
              <Route
                path="activity-history"
                element={<UserActivityHistoryPage />}
              />
            </Route>
          </Routes>
        </Router>
      </QueryClientProvider>
    </>
  );
}

export default App;
