import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { updatePatientProfile, addMedicalHistory } from '../services/patientService'
import { updateDoctorProfile } from '../services/doctorService'

const Profile = () => {
  const { user, token } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const [formErrors, setFormErrors] = useState({})
  
  // For medical history
  const [showMedicalHistoryForm, setShowMedicalHistoryForm] = useState(false)
  const [medicalHistoryData, setMedicalHistoryData] = useState({
    condition: '',
    date: '',
    notes: ''
  })

  useEffect(() => {
    if (user) {
      setProfile(user)
      initializeFormData(user)
      setLoading(false)
    }
  }, [user])

  const initializeFormData = (userData) => {
    if (userData.role === 'patient') {
      setFormData({
        phone: userData.patientDetails?.phone || '',
        address: userData.patientDetails?.address || '',
        emergencyContactName: userData.patientDetails?.emergencyContact?.name || '',
        emergencyContactPhone: userData.patientDetails?.emergencyContact?.phone || '',
        emergencyContactRelation: userData.patientDetails?.emergencyContact?.relation || ''
      })
    } else if (userData.role === 'doctor') {
      setFormData({
        specialization: userData.doctorDetails?.specialization || '',
        qualification: userData.doctorDetails?.qualification || '',
        experience: userData.doctorDetails?.experience || '',
        phone: userData.doctorDetails?.phone || '',
        schedule: userData.doctorDetails?.schedule || [
          { day: 'Monday', startTime: '09:00', endTime: '17:00' },
          { day: 'Tuesday', startTime: '09:00', endTime: '17:00' }
        ]
      })
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    
    // Clear field-specific error when user types
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' })
    }
  }

  const handleScheduleChange = (index, field, value) => {
    const updatedSchedule = [...formData.schedule]
    updatedSchedule[index] = { ...updatedSchedule[index], [field]: value }
    setFormData({ ...formData, schedule: updatedSchedule })
  }

  const handleMedicalHistoryChange = (e) => {
    const { name, value } = e.target
    setMedicalHistoryData({ ...medicalHistoryData, [name]: value })
  }

  const validateForm = () => {
    const errors = {}
    
    if (user.role === 'patient') {
      if (!formData.phone.trim()) {
        errors.phone = 'Phone number is required'
      }
      
      if (!formData.address.trim()) {
        errors.address = 'Address is required'
      }
    } else if (user.role === 'doctor') {
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

  const validateMedicalHistoryForm = () => {
    const errors = {}
    
    if (!medicalHistoryData.condition.trim()) {
      errors.condition = 'Condition is required'
    }
    
    if (!medicalHistoryData.date) {
      errors.date = 'Date is required'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    try {
      let response
      
      if (user.role === 'patient') {
        const patientData = {
          phone: formData.phone,
          address: formData.address,
          emergencyContact: {
            name: formData.emergencyContactName,
            phone: formData.emergencyContactPhone,
            relation: formData.emergencyContactRelation
          }
        }
        
        response = await updatePatientProfile(token, patientData)
        setProfile({
          ...profile,
          patientDetails: response.patient
        })
      } else if (user.role === 'doctor') {
        const doctorData = {
          specialization: formData.specialization,
          qualification: formData.qualification,
          experience: parseInt(formData.experience, 10),
          phone: formData.phone,
          schedule: formData.schedule
        }
        
        response = await updateDoctorProfile(token, doctorData)
        setProfile({
          ...profile,
          doctorDetails: response.doctor
        })
      }
      
      setSuccess('Profile updated successfully')
      setIsEditing(false)
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (err) {
      console.error('Error updating profile:', err)
      setError('Failed to update profile. Please try again.')
    }
  }

  const handleAddMedicalHistory = async (e) => {
    e.preventDefault()
    
    if (!validateMedicalHistoryForm()) {
      return
    }
    
    try {
      const response = await addMedicalHistory(token, medicalHistoryData)
      
      setProfile({
        ...profile,
        patientDetails: response.patient
      })
      
      setSuccess('Medical history added successfully')
      setShowMedicalHistoryForm(false)
      setMedicalHistoryData({
        condition: '',
        date: '',
        notes: ''
      })
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (err) {
      console.error('Error adding medical history:', err)
      setError('Failed to add medical history. Please try again.')
    }
  }

  if (loading) {
    return <div className="spinner"></div>
  }

  return (
    <div>
      <h1>My Profile</h1>
      
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <div className="profile-container">
        <div className="card">
          <div className="profile-header">
            <div className="profile-avatar">
              {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
            </div>
            
            <div className="profile-info">
              <h2>{profile.firstName} {profile.lastName}</h2>
              <div className="profile-role">{profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}</div>
            </div>
          </div>
          
          <div style={{ marginTop: 'var(--space-4)' }}>
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                Email
              </label>
              <p>{profile.email}</p>
            </div>
            
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                Username
              </label>
              <p>{profile.username}</p>
            </div>
            
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                Member Since
              </label>
              <p>{new Date(profile.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          
          <button 
            className="button w-full mt-4" 
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel Editing' : 'Edit Profile'}
          </button>
        </div>
        
        <div className="card">
          {isEditing ? (
            <form onSubmit={handleUpdateProfile}>
              <h2>Edit Profile</h2>
              
              {profile.role === 'patient' && (
                <>
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
              
              {profile.role === 'doctor' && (
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
                  
                  {formData.schedule && formData.schedule.map((scheduleItem, index) => (
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
              
              <button type="submit" className="button w-full">
                Save Changes
              </button>
            </form>
          ) : (
            <>
              {profile.role === 'patient' && (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h2>Patient Information</h2>
                  </div>
                  
                  <div style={{ marginBottom: 'var(--space-4)' }}>
                    <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                      Date of Birth
                    </label>
                    <p>{profile.patientDetails?.dateOfBirth ? new Date(profile.patientDetails.dateOfBirth).toLocaleDateString() : 'Not provided'}</p>
                  </div>
                  
                  <div style={{ marginBottom: 'var(--space-4)' }}>
                    <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                      Phone Number
                    </label>
                    <p>{profile.patientDetails?.phone || 'Not provided'}</p>
                  </div>
                  
                  <div style={{ marginBottom: 'var(--space-4)' }}>
                    <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                      Address
                    </label>
                    <p>{profile.patientDetails?.address || 'Not provided'}</p>
                  </div>
                  
                  <div style={{ marginBottom: 'var(--space-6)' }}>
                    <h3>Emergency Contact</h3>
                    
                    {profile.patientDetails?.emergencyContact?.name ? (
                      <>
                        <p><strong>Name:</strong> {profile.patientDetails.emergencyContact.name}</p>
                        <p><strong>Phone:</strong> {profile.patientDetails.emergencyContact.phone}</p>
                        <p><strong>Relation:</strong> {profile.patientDetails.emergencyContact.relation}</p>
                      </>
                    ) : (
                      <p>No emergency contact provided</p>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3>Medical History</h3>
                      <button 
                        className="button button-secondary"
                        onClick={() => setShowMedicalHistoryForm(!showMedicalHistoryForm)}
                      >
                        {showMedicalHistoryForm ? 'Cancel' : 'Add Entry'}
                      </button>
                    </div>
                    
                    {showMedicalHistoryForm && (
                      <form onSubmit={handleAddMedicalHistory} className="card" style={{ marginBottom: 'var(--space-6)' }}>
                        <div className="form-group">
                          <label htmlFor="condition">Condition</label>
                          <input
                            type="text"
                            id="condition"
                            name="condition"
                            value={medicalHistoryData.condition}
                            onChange={handleMedicalHistoryChange}
                            placeholder="e.g., Diabetes, Hypertension"
                          />
                          {formErrors.condition && <div className="alert alert-error">{formErrors.condition}</div>}
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor="date">Date Diagnosed</label>
                          <input
                            type="date"
                            id="date"
                            name="date"
                            value={medicalHistoryData.date}
                            onChange={handleMedicalHistoryChange}
                          />
                          {formErrors.date && <div className="alert alert-error">{formErrors.date}</div>}
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor="notes">Notes</label>
                          <textarea
                            id="notes"
                            name="notes"
                            value={medicalHistoryData.notes}
                            onChange={handleMedicalHistoryChange}
                            rows="3"
                            placeholder="Additional notes about the condition"
                          ></textarea>
                        </div>
                        
                        <button type="submit" className="button w-full">
                          Add Medical History
                        </button>
                      </form>
                    )}
                    
                    {profile.patientDetails?.medicalHistory && profile.patientDetails.medicalHistory.length > 0 ? (
                      <div>
                        {profile.patientDetails.medicalHistory.map((item, index) => (
                          <div key={index} className="medical-history-item">
                            <div className="medical-history-date">
                              {new Date(item.date).toLocaleDateString()}
                            </div>
                            <div className="medical-history-condition">
                              {item.condition}
                            </div>
                            {item.notes && <p>{item.notes}</p>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No medical history records found</p>
                    )}
                  </div>
                </>
              )}
              
              {profile.role === 'doctor' && (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h2>Doctor Information</h2>
                  </div>
                  
                  <div style={{ marginBottom: 'var(--space-4)' }}>
                    <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                      Specialization
                    </label>
                    <p>{profile.doctorDetails?.specialization || 'Not provided'}</p>
                  </div>
                  
                  <div style={{ marginBottom: 'var(--space-4)' }}>
                    <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                      Qualification
                    </label>
                    <p>{profile.doctorDetails?.qualification || 'Not provided'}</p>
                  </div>
                  
                  <div style={{ marginBottom: 'var(--space-4)' }}>
                    <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                      Experience
                    </label>
                    <p>{profile.doctorDetails?.experience ? `${profile.doctorDetails.experience} years` : 'Not provided'}</p>
                  </div>
                  
                  <div style={{ marginBottom: 'var(--space-4)' }}>
                    <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                      Phone Number
                    </label>
                    <p>{profile.doctorDetails?.phone || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <h3>Weekly Schedule</h3>
                    
                    {profile.doctorDetails?.schedule && profile.doctorDetails.schedule.length > 0 ? (
                      <div>
                        {profile.doctorDetails.schedule.map((scheduleItem, index) => (
                          <div key={index} style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            padding: 'var(--space-3) 0',
                            borderBottom: index < profile.doctorDetails.schedule.length - 1 ? '1px solid var(--border-color)' : 'none'
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
                      <p>No schedule information available</p>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile