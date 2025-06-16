import axios from 'axios'

const API_URL = 'http://localhost:3000/api/auth'

// Register new user
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, userData)
    return response.data
  } catch (error) {
    throw error
  }
}

// Login user
export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials)
    return response.data
  } catch (error) {
    throw error
  }
}

// Get user profile
export const getProfile = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    throw error
  }
}