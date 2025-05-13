import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import "./style.css";
import AdminPage from "./pages/AdminPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MainLayout from "./layouts/MainLayout";
import CodeEntryPage from "./pages/CodeEntryPage";
import CodeRequestPage from "./pages/CodeRequestPage";
import LoginPage from "./pages/LoginPage";
import { ToastContainer } from "react-toastify";

// tanstack react-query client
const queryClient = new QueryClient();

function App() {
  return (
    <>
      <ToastContainer />
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            {/* Login */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<LoginPage />}></Route>
            </Route>
            {/* Admin router */}
            <Route path="/admin" element={<MainLayout />}>
              <Route index element={<AdminPage />}></Route>
            </Route>
            <Route path="/code-input" element={<MainLayout />}>
              <Route index element={<CodeEntryPage />}></Route>
            </Route>
            <Route path="/code-request" element={<MainLayout />}>
              <Route index element={<CodeRequestPage />}></Route>
            </Route>
          </Routes>
        </Router>
      </QueryClientProvider>
    </>
  );
}

export default App;
