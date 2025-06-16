import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { createAppointment } from '../../services/appointmentService'
import { getAllDoctors, getDoctorById } from '../../services/doctorService'

const CreateAppointment = () => {
  const { token } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const preselectedDoctorId = queryParams.get('doctorId')
  
  const [doctors, setDoctors] = useState([])
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    doctorId: preselectedDoctorId || '',
    appointmentDate: '',
    appointmentTime: '',
    reason: ''
  })
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const doctorsData = await getAllDoctors()
        setDoctors(doctorsData.doctors)
        
        // If doctor ID is provided in URL, fetch that doctor's details
        if (preselectedDoctorId) {
          const doctorData = await getDoctorById(preselectedDoctorId)
          setSelectedDoctor(doctorData.doctor)
          setFormData(prev => ({ ...prev, doctorId: preselectedDoctorId }))
        }
      } catch (err) {
        console.error('Error fetching doctors:', err)
        setError('Failed to load doctors. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [preselectedDoctorId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    
    // Clear field-specific error when user types
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' })
    }
    
    // If doctor selection changes, fetch that doctor's details
    if (name === 'doctorId' && value) {
      fetchDoctorDetails(value)
    }
  }

  const fetchDoctorDetails = async (doctorId) => {
    try {
      const doctorData = await getDoctorById(doctorId)
      setSelectedDoctor(doctorData.doctor)
    } catch (err) {
      console.error('Error fetching doctor details:', err)
      setError('Failed to load doctor details.')
    }
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.doctorId) {
      errors.doctorId = 'Please select a doctor'
    }
    
    if (!formData.appointmentDate) {
      errors.appointmentDate = 'Please select a date'
    } else {
      const selectedDate = new Date(formData.appointmentDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (selectedDate < today) {
        errors.appointmentDate = 'Appointment date cannot be in the past'
      }
    }
    
    if (!formData.appointmentTime) {
      errors.appointmentTime = 'Please select a time'
    }
    
    if (!formData.reason.trim()) {
      errors.reason = 'Please provide a reason for the appointment'
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
      setFormSubmitting(true)
      await createAppointment(token, formData)
      navigate('/appointments', { state: { success: true, message: 'Appointment created successfully' } })
    } catch (err) {
      console.error('Error creating appointment:', err)
      setError('Failed to create appointment. Please try again.')
    } finally {
      setFormSubmitting(false)
    }
  }

  if (loading) {
    return <div className="spinner"></div>
  }

  return (
    <div>
      <Link to="/doctors" className="button button-secondary mb-4">
        ← Back to Doctors
      </Link>
      
      <h1>Book an Appointment</h1>
      
      {error && <div className="alert alert-error">{error}</div>}
      
      <div className="grid grid-cols-1 grid-cols-md-2" style={{ gap: 'var(--space-6)' }}>
        <div className="card">
          <h2>Appointment Details</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="doctorId">Select Doctor</label>
              <select
                id="doctorId"
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                disabled={!!preselectedDoctorId}
              >
                <option value="">-- Select a Doctor --</option>
                {doctors.map(doctor => (
                  <option key={doctor._id} value={doctor._id}>
                    Dr. {doctor.userId.firstName} {doctor.userId.lastName} ({doctor.specialization})
                  </option>
                ))}
              </select>
              {formErrors.doctorId && <div className="alert alert-error">{formErrors.doctorId}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="appointmentDate">Date</label>
              <input
                type="date"
                id="appointmentDate"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
              />
              {formErrors.appointmentDate && <div className="alert alert-error">{formErrors.appointmentDate}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="appointmentTime">Time</label>
              <input
                type="time"
                id="appointmentTime"
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleChange}
              />
              {formErrors.appointmentTime && <div className="alert alert-error">{formErrors.appointmentTime}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="reason">Reason for Visit</label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows="3"
                placeholder="Briefly describe your symptoms or reason for appointment"
              ></textarea>
              {formErrors.reason && <div className="alert alert-error">{formErrors.reason}</div>}
            </div>
            
            <button 
              type="submit" 
              className="button w-full" 
              disabled={formSubmitting}
            >
              {formSubmitting ? 'Booking...' : 'Book Appointment'}
            </button>
          </form>
        </div>
        
        {selectedDoctor && (
          <div className="card">
            <h2>Doctor Information</h2>
            
            <div className="profile-header" style={{ marginBottom: 'var(--space-4)' }}>
              <div className="profile-avatar">
                {selectedDoctor.userId.firstName.charAt(0)}{selectedDoctor.userId.lastName.charAt(0)}
              </div>
              
              <div className="profile-info">
                <h3>Dr. {selectedDoctor.userId.firstName} {selectedDoctor.userId.lastName}</h3>
                <div className="doctor-specialization">{selectedDoctor.specialization}</div>
              </div>
            </div>
            
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                Qualifications
              </label>
              <p>{selectedDoctor.qualification}</p>
            </div>
            
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                Experience
              </label>
              <p>{selectedDoctor.experience} years</p>
            </div>
            
            <h3>Available Schedule</h3>
            
            {selectedDoctor.schedule && selectedDoctor.schedule.length > 0 ? (
              <div>
                {selectedDoctor.schedule.map((scheduleItem, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    padding: 'var(--space-2) 0',
                    borderBottom: index < selectedDoctor.schedule.length - 1 ? '1px solid var(--border-color)' : 'none'
                  }}>
                    <div style={{ fontWeight: 'var(--font-weight-medium)' }}>
                      {scheduleItem.day}
                    </div>
                    <div>
                      {scheduleItem.startTime} - {scheduleItem.endTime}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No schedule information available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CreateAppointment