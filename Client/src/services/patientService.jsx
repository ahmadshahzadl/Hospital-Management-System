import axios from 'axios'

const API_URL = 'http://localhost:3000/api/patients'

// Get patient by ID (for doctors/admin)
export const getPatientById = async (token, id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// Update patient profile
export const updatePatientProfile = async (token, patientData) => {
  try {
    const response = await axios.put(`${API_URL}/profile`, patientData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// Add medical history
export const addMedicalHistory = async (token, medicalHistoryData) => {
  try {
    const response = await axios.post(`${API_URL}/medical-history`, medicalHistoryData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    throw error
  }
}