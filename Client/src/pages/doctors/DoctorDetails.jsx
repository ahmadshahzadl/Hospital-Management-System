import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getDoctorById } from '../../services/doctorService'

const DoctorDetails = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true)
        const data = await getDoctorById(id)
        setDoctor(data.doctor)
      } catch (err) {
        console.error('Error fetching doctor details:', err)
        setError('Failed to load doctor details. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchDoctor()
  }, [id])

  if (loading) {
    return <div className="spinner"></div>
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>
  }

  if (!doctor) {
    return <div className="alert alert-error">Doctor not found.</div>
  }

  return (
    <div>
      <Link to="/doctors" className="button button-secondary mb-4">
        ← Back to Doctors
      </Link>
      
      <div className="card">
        <div className="profile-header">
          <div className="profile-avatar">
            {doctor.userId.firstName.charAt(0)}{doctor.userId.lastName.charAt(0)}
          </div>
          
          <div className="profile-info">
            <h1>Dr. {doctor.userId.firstName} {doctor.userId.lastName}</h1>
            <div className="doctor-specialization">{doctor.specialization}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 grid-cols-md-2" style={{ gap: 'var(--space-6)' }}>
          <div>
            <h2>Doctor Information</h2>
            
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                Qualifications
              </label>
              <p>{doctor.qualification}</p>
            </div>
            
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                Experience
              </label>
              <p>{doctor.experience} years</p>
            </div>
            
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                Contact Number
              </label>
              <p>{doctor.phone}</p>
            </div>
            
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                Email
              </label>
              <p>{doctor.userId.email}</p>
            </div>
          </div>
          
          <div>
            <h2>Weekly Schedule</h2>
            
            {doctor.schedule && doctor.schedule.length > 0 ? (
              <div>
                {doctor.schedule.map((scheduleItem, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    padding: 'var(--space-3) 0',
                    borderBottom: '1px solid var(--border-color)'
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
        </div>
        
        {user && user.role === 'patient' && (
          <div style={{ marginTop: 'var(--space-6)', textAlign: 'center' }}>
            <Link to={`/appointments/new?doctorId=${doctor._id}`} className="button">
              Book an Appointment
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorDetails