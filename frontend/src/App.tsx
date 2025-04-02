import { useState } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom'
import './App.css'
import AdminPage from './pages/AdminPage'
import AdminLayout from './layouts/AdminLayout'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// tanstack react-query client
const queryClient = new QueryClient()

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            {/* Admin routed */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminPage />}></Route>
            </Route>
          </Routes>
        </Router>
      </QueryClientProvider>
    </>
  )
}

export default App
