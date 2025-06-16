import { Link } from 'react-router-dom'

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-container card">
      <Link to="/" className="logo" style={{ justifyContent: 'center', marginBottom: 'var(--space-6)' }}>
        <span>Hospital Management System</span>
      </Link>
      
      {children}
    </div>
  )
}

export default AuthLayout