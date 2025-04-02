import { useState } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AdminPage from './pages/AdminPage'

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Admin routed */}
          <Route path="/admin" element={<AdminPage />}></Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
