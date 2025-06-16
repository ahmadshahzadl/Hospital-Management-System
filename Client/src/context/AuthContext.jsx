import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, register, getProfile } from '../services/authService'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Check if user is authenticated on initial load
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await getProfile(token)
        setUser(response.profile)
        setError(null)
      } catch (err) {
        console.error('Authentication error:', err)
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
        setError('Session expired. Please login again.')
      } finally {
        setLoading(false)
      }
    }

    verifyToken()
  }, [token])

  // Login function
  const handleLogin = async (credentials) => {
    try {
      setLoading(true)
      const response = await login(credentials)
      localStorage.setItem('token', response.token)
      setToken(response.token)
      setUser(response.user)
      setError(null)
      navigate('/dashboard')
      return response
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Register function
  const handleRegister = async (userData) => {
    try {
      setLoading(true)
      const response = await register(userData)
      localStorage.setItem('token', response.token)
      setToken(response.token)
      setUser(response.user)
      setError(null)
      navigate('/dashboard')
      return response
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    navigate('/login')
  }

  // Clear error
  const clearError = () => setError(null)

  const value = {
    user,
    token,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    clearError
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}