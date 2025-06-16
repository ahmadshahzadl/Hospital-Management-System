import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import './App.css'

// Layouts
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'

// Pages
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/Dashboard'
import DoctorsList from './pages/doctors/DoctorsList'
import DoctorDetails from './pages/doctors/DoctorDetails'
import AppointmentsList from './pages/appointments/AppointmentsList'
import CreateAppointment from './pages/appointments/CreateAppointment'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div className="spinner"></div>
  }
  
  if (!user) {
    return <Navigate to="/login" />
  }
  
  return children
}

// Role-based route component
const RoleRoute = ({ roles, children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div className="spinner"></div>
  }
  
  if (!user) {
    return <Navigate to="/login" />
  }
  
  if (!roles.includes(user.role)) {
    return <Navigate to="/dashboard" />
  }
  
  return children
}

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        
        {/* Auth routes */}
        <Route path="login" element={
          <AuthLayout>
            <Login />
          </AuthLayout>
        } />
        <Route path="register" element={
          <AuthLayout>
            <Register />
          </AuthLayout>
        } />
        
        {/* Protected routes */}
        <Route path="dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        {/* Doctor routes */}
        <Route path="doctors" element={<DoctorsList />} />
        <Route path="doctors/:id" element={<DoctorDetails />} />
        
        {/* Appointment routes */}
        <Route path="appointments" element={
          <ProtectedRoute>
            <AppointmentsList />
          </ProtectedRoute>
        } />
        <Route path="appointments/new" element={
          <RoleRoute roles={['patient']}>
            <CreateAppointment />
          </RoleRoute>
        } />
        
        {/* Profile route */}
        <Route path="profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App