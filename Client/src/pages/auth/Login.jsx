import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [formErrors, setFormErrors] = useState({})
  const { login, error, clearError } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    // Clear field-specific error when user types
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' })
    }
    // Clear global error
    if (error) {
      clearError()
    }
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      errors.password = 'Password is required'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    try {
      await login(formData)
    } catch (err) {
      // Error is handled in the AuthContext
      console.error('Login error:', err)
    }
  }

  return (
    <div>
      <h2 className="auth-title">Login to Your Account</h2>
      
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          {formErrors.email && <div className="alert alert-error">{formErrors.email}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
          {formErrors.password && <div className="alert alert-error">{formErrors.password}</div>}
        </div>
        
        <button type="submit" className="button w-full">
          Login
        </button>
      </form>
      
      <div className="auth-switch">
        Don't have an account? <Link to="/register">Register now</Link>
      </div>
    </div>
  )
}

export default Login