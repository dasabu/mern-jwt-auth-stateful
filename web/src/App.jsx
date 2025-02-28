import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Login from '~/pages/Login'
import Dashboard from '~/pages/Dashboard'

const ProtectedRoutes = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (!user) return <Navigate to="/login" replace={true} />
  else return <Outlet />
}

const UnauthorizedRoutes = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (user) return <Navigate to="/dashboard" replace={true} />
  else return <Outlet />
}

function App() {
  return (
    <Routes>
      <Route element={<UnauthorizedRoutes />}>
        <Route path="/" element={<Navigate to="/login" replace={true} />} />
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<ProtectedRoutes />}>
        {/* Outlet will run into children routes of parent route */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  )
}

export default App
