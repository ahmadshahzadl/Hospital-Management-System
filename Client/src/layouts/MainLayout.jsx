import { useState } from 'react'
import { Outlet, Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const MainLayout = () => {
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <div className="app-layout">
      <header className="header">
        <div className="container header-container">
          <Link to="/" className="logo">
            <span>Hospital Management System</span>
          </Link>

          <button 
            className="mobile-menu-button" 
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            ☰
          </button>

          <nav className={`nav ${mobileMenuOpen ? 'show' : ''}`}>
            <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink 
              to="/doctors" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              onClick={() => setMobileMenuOpen(false)}
            >
              Doctors
            </NavLink>
            
            {user ? (
              <>
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </NavLink>
                <NavLink 
                  to="/appointments" 
                  className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Appointments
                </NavLink>
                <NavLink 
                  to="/profile" 
                  className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </NavLink>
                <button 
                  onClick={() => {
                    logout()
                    setMobileMenuOpen(false)
                  }} 
                  className="button"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink 
                  to="/login" 
                  className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </NavLink>
                <NavLink 
                  to="/register" 
                  className="button"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <Outlet />
        </div>
      </main>

      <footer className="footer">
        <div className="container footer-content">
          <div className="footer-copyright">
            © {new Date().getFullYear()} Hospital Management System
          </div>
          <div className="footer-links">
            <Link to="/" className="footer-link">Terms</Link>
            <Link to="/" className="footer-link">Privacy</Link>
            <Link to="/" className="footer-link">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default MainLayout