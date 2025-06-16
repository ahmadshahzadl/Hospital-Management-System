import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAppointments } from '../services/appointmentService'

const Dashboard = () => {
  const { user, token } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true)
        const data = await getAppointments(token)
        setAppointments(data.appointments)
      } catch (err) {
        console.error('Error fetching appointments:', err)
        setError('Failed to load appointments. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [token])

  // Get upcoming appointments (max 3)
  const upcomingAppointments = appointments
    .filter(app => app.status === 'scheduled')
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
    .slice(0, 3)

  if (loading) {
    return <div className="spinner"></div>
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>
  }

  return (
    <div>
      <h1>Dashboard</h1>
      
      <section className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-title">Total Appointments</div>
          <div className="stat-value">{appointments.length}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-title">Upcoming</div>
          <div className="stat-value">
            {appointments.filter(app => app.status === 'scheduled').length}
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-title">Completed</div>
          <div className="stat-value">
            {appointments.filter(app => app.status === 'completed').length}
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-title">Cancelled</div>
          <div className="stat-value">
            {appointments.filter(app => app.status === 'cancelled').length}
          </div>
        </div>
      </section>
      
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2>Upcoming Appointments</h2>
          <Link to="/appointments" className="button button-secondary">View All</Link>
        </div>
        
        {upcomingAppointments.length === 0 ? (
          <div className="card text-center">
            <p>You have no upcoming appointments.</p>
            {user.role === 'patient' && (
              <Link to="/appointments/new" className="button">Book an Appointment</Link>
            )}
          </div>
        ) : (
          <div>
            {upcomingAppointments.map(appointment => (
              <div key={appointment._id} className="appointment-card">
                <div className="appointment-header">
                  <div className="appointment-date">
                    {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.appointmentTime}
                  </div>
                  <div className={`appointment-status status-${appointment.status}`}>
                    {appointment.status}
                  </div>
                </div>
                
                <div>
                  {user.role === 'patient' ? (
                    <p>Doctor: Dr. {appointment.doctorId.userId.firstName} {appointment.doctorId.userId.lastName}</p>
                  ) : (
                    <p>Patient: {appointment.patientId.userId.firstName} {appointment.patientId.userId.lastName}</p>
                  )}
                </div>
                
                <p><strong>Reason:</strong> {appointment.reason}</p>
                
                {appointment.notes && (
                  <p><strong>Notes:</strong> {appointment.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
      
      {user.role === 'patient' && (
        <section style={{ marginTop: 'var(--space-10)' }}>
          <div className="flex justify-between items-center mb-4">
            <h2>Quick Actions</h2>
          </div>
          
          <div className="grid grid-cols-1 grid-cols-md-3" style={{ gap: 'var(--space-4)' }}>
            <Link to="/appointments/new" className="card" style={{ textAlign: 'center' }}>
              <h3>Book Appointment</h3>
              <p>Schedule a new appointment with a doctor</p>
            </Link>
            
            <Link to="/doctors" className="card" style={{ textAlign: 'center' }}>
              <h3>Find Doctors</h3>
              <p>Browse doctors by specialization</p>
            </Link>
            
            <Link to="/profile" className="card" style={{ textAlign: 'center' }}>
              <h3>Update Profile</h3>
              <p>Manage your personal information</p>
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}

export default Dashboard