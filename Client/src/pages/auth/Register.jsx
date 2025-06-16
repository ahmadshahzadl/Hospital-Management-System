import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Register = () => {
  const [step, setStep] = useState(1)
  const [role, setRole] = useState('patient')
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'patient',
    // Patient specific fields
    dateOfBirth: '',
    phone: '',
    address: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    // Doctor specific fields
    specialization: '',
    qualification: '',
    experience: '',
    schedule: [
      { day: 'Monday', startTime: '09:00', endTime: '17:00' },
      { day: 'Tuesday', startTime: '09:00', endTime: '17:00' }
    ]
  })
  const [formErrors, setFormErrors] = useState({})
  const { register, error, clearError } = useAuth()

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
    
    // Update role state if role field changes
    if (name === 'role') {
      setRole(value)
    }
  }

  const handleScheduleChange = (index, field, value) => {
    const updatedSchedule = [...formData.schedule]
    updatedSchedule[index] = { ...updatedSchedule[index], [field]: value }
    setFormData({ ...formData, schedule: updatedSchedule })
  }

  const validateStep1 = () => {
    const errors = {}
    
    if (!formData.username.trim()) {
      errors.username = 'Username is required'
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateStep2 = () => {
    const errors = {}
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required'
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required'
    }
    
    if (role === 'patient') {
      if (!formData.dateOfBirth) {
        errors.dateOfBirth = 'Date of birth is required'
      }
      
      if (!formData.phone.trim()) {
        errors.phone = 'Phone number is required'
      }
      
      if (!formData.address.trim()) {
        errors.address = 'Address is required'
      }
    } else if (role === 'doctor') {
      if (!formData.specialization.trim()) {
        errors.specialization = 'Specialization is required'
      }
      
      if (!formData.qualification.trim()) {
        errors.qualification = 'Qualification is required'
      }
      
      if (!formData.experience) {
        errors.experience = 'Experience is required'
      }
      
      if (!formData.phone.trim()) {
        errors.phone = 'Phone number is required'
      }
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    }
  }

  const prevStep = () => {
    setStep(1)
  }

  const prepareDataForSubmission = () => {
    const data = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      firstName: formData.firstName,
      lastName: formData.lastName,
    }
    
    if (role === 'patient') {
      data.dateOfBirth = formData.dateOfBirth
      data.phone = formData.phone
      data.address = formData.address
      data.emergencyContact = {
        name: formData.emergencyContactName,
        phone: formData.emergencyContactPhone,
        relation: formData.emergencyContactRelation
      }
    } else if (role === 'doctor') {
      data.specialization = formData.specialization
      data.qualification = formData.qualification
      data.experience = parseInt(formData.experience, 10)
      data.phone = formData.phone
      data.schedule = formData.schedule
    }
    
    return data
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (step === 2 && validateStep2()) {
      try {
        const registrationData = prepareDataForSubmission()
        await register(registrationData)
      } catch (err) {
        // Error is handled in the AuthContext
        console.error('Registration error:', err)
      }
    }
  }

  return (
    <div>
      <h2 className="auth-title">Create an Account</h2>
      
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <>
            <div className="form-group">
              <label htmlFor="role">Register as</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
              />
              {formErrors.username && <div className="alert alert-error">{formErrors.username}</div>}
            </div>
            
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
                placeholder="Create a password"
              />
              {formErrors.password && <div className="alert alert-error">{formErrors.password}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
              />
              {formErrors.confirmPassword && <div className="alert alert-error">{formErrors.confirmPassword}</div>}
            </div>
            
            <button type="button" className="button w-full" onClick={nextStep}>
              Next
            </button>
          </>
        )}
        
        {step === 2 && (
          <>
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
              />
              {formErrors.firstName && <div className="alert alert-error">{formErrors.firstName}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
              />
              {formErrors.lastName && <div className="alert alert-error">{formErrors.lastName}</div>}
            </div>
            
            {/* Patient-specific fields */}
            {role === 'patient' && (
              <>
                <div className="form-group">
                  <label htmlFor="dateOfBirth">Date of Birth</label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                  />
                  {formErrors.dateOfBirth && <div className="alert alert-error">{formErrors.dateOfBirth}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />
                  {formErrors.phone && <div className="alert alert-error">{formErrors.phone}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your address"
                    rows="3"
                  ></textarea>
                  {formErrors.address && <div className="alert alert-error">{formErrors.address}</div>}
                </div>
                
                <h3>Emergency Contact</h3>
                
                <div className="form-group">
                  <label htmlFor="emergencyContactName">Name</label>
                  <input
                    type="text"
                    id="emergencyContactName"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleChange}
                    placeholder="Emergency contact name"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="emergencyContactPhone">Phone</label>
                  <input
                    type="tel"
                    id="emergencyContactPhone"
                    name="emergencyContactPhone"
                    value={formData.emergencyContactPhone}
                    onChange={handleChange}
                    placeholder="Emergency contact phone"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="emergencyContactRelation">Relation</label>
                  <input
                    type="text"
                    id="emergencyContactRelation"
                    name="emergencyContactRelation"
                    value={formData.emergencyContactRelation}
                    onChange={handleChange}
                    placeholder="Relation to emergency contact"
                  />
                </div>
              </>
            )}
            
            {/* Doctor-specific fields */}
            {role === 'doctor' && (
              <>
                <div className="form-group">
                  <label htmlFor="specialization">Specialization</label>
                  <input
                    type="text"
                    id="specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    placeholder="e.g., Cardiology, Pediatrics"
                  />
                  {formErrors.specialization && <div className="alert alert-error">{formErrors.specialization}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="qualification">Qualification</label>
                  <input
                    type="text"
                    id="qualification"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    placeholder="e.g., MBBS, MD"
                  />
                  {formErrors.qualification && <div className="alert alert-error">{formErrors.qualification}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="experience">Years of Experience</label>
                  <input
                    type="number"
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="Years of experience"
                    min="0"
                  />
                  {formErrors.experience && <div className="alert alert-error">{formErrors.experience}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />
                  {formErrors.phone && <div className="alert alert-error">{formErrors.phone}</div>}
                </div>
                
                <h3>Weekly Schedule</h3>
                
                {formData.schedule.map((scheduleItem, index) => (
                  <div key={index} style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                    <div style={{ flex: '1' }}>
                      <label>Day</label>
                      <select
                        value={scheduleItem.day}
                        onChange={(e) => handleScheduleChange(index, 'day', e.target.value)}
                      >
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                      </select>
                    </div>
                    
                    <div style={{ flex: '1' }}>
                      <label>Start Time</label>
                      <input
                        type="time"
                        value={scheduleItem.startTime}
                        onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)}
                      />
                    </div>
                    
                    <div style={{ flex: '1' }}>
                      <label>End Time</label>
                      <input
                        type="time"
                        value={scheduleItem.endTime}
                        onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </>
            )}
            
            <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
              <button type="button" className="button button-secondary" onClick={prevStep} style={{ flex: '1' }}>
                Back
              </button>
              <button type="submit" className="button" style={{ flex: '1' }}>
                Register
              </button>
            </div>
          </>
        )}
      </form>
      
      <div className="auth-switch">
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  )
}

export default Register