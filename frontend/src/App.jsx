import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'

import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './components/layout/AppLayout'
import AuthLayout from './components/layout/AuthLayout'

import PalettePage from './pages/PalettePage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import BudgetPage from './pages/BudgetPage'
import ExpensesPage from './pages/ExpensesPage'
import ReportsPage from './pages/ReportsPage'
import LogPage from './pages/LogPage'

export default function App() {
  return (
    <>
      <Toaster position="bottom-right" richColors />
      <Routes>
        {/* ── Unauthenticated routes ────────────────────────────────────── */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* ── Authenticated routes ──────────────────────────────────────── */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="/budget" element={<BudgetPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/expenses/log" element={<LogPage />} />
          <Route path="/reports" element={<ReportsPage/>}/>
        </Route>

        {/* ── Dev only ─────────────────────────────────────────────────── */}
        <Route path="/palette" element={<PalettePage />} />

        {/* ── Fallback ─────────────────────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}