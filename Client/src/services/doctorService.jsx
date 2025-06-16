import axios from 'axios'

const API_URL = 'http://localhost:3000/api/doctors'

// Get all doctors
export const getAllDoctors = async () => {
  try {
    const response = await axios.get(API_URL)
    return response.data
  } catch (error) {
    throw error
  }
}

// Get doctor by ID
export const getDoctorById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}

// Get doctors by specialization
export const getDoctorsBySpecialization = async (specialization) => {
  try {
    const response = await axios.get(`${API_URL}/specialization/${specialization}`)
    return response.data
  } catch (error) {
    throw error
  }
}

// Update doctor profile
export const updateDoctorProfile = async (token, doctorData) => {
  try {
    const response = await axios.put(`${API_URL}/profile`, doctorData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    throw error
  }
}