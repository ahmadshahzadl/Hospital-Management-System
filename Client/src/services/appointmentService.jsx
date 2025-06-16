import axios from 'axios'

const API_URL = 'http://localhost:3000/api/appointments'

// Get appointments
export const getAppointments = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// Create appointment
export const createAppointment = async (token, appointmentData) => {
  try {
    const response = await axios.post(API_URL, appointmentData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// Update appointment (for doctors)
export const updateAppointment = async (token, appointmentId, updateData) => {
  try {
    const response = await axios.put(`${API_URL}/${appointmentId}`, updateData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// Cancel appointment
export const cancelAppointment = async (token, appointmentId) => {
  try {
    const response = await axios.delete(`${API_URL}/${appointmentId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    throw error
  }
}