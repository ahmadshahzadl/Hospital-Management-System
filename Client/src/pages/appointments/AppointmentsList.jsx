import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getAppointments, updateAppointment, cancelAppointment } from '../../services/appointmentService'

const AppointmentsList = () => {
  const { user, token } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [activeAppointment, setActiveAppointment] = useState(null)
  const [notes, setNotes] = useState('')

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

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value)
  }

  const openUpdateModal = (appointment) => {
    setActiveAppointment(appointment)
    setNotes(appointment.notes || '')
  }

  const closeUpdateModal = () => {
    setActiveAppointment(null)
    setNotes('')
  }

  const handleUpdateAppointment = async (status) => {
    try {
      await updateAppointment(token, activeAppointment._id, { status, notes })
      
      // Update the appointment in the local state
      const updatedAppointments = appointments.map(app => 
        app._id === activeAppointment._id 
          ? { ...app, status, notes } 
          : app
      )
      
      setAppointments(updatedAppointments)
      closeUpdateModal()
    } catch (err) {
      console.error('Error updating appointment:', err)
      setError('Failed to update appointment. Please try again.')
    }
  }

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return
    }
    
    try {
      await cancelAppointment(token, appointmentId)
      
      // Update the appointment in the local state
      const updatedAppointments = appointments.map(app => 
        app._id === appointmentId 
          ? { ...app, status: 'cancelled' } 
          : app
      )
      
      setAppointments(updatedAppointments)
    } catch (err) {
      console.error('Error cancelling appointment:', err)
      setError('Failed to cancel appointment. Please try again.')
    }
  }

  const filteredAppointments = statusFilter === 'all' 
    ? appointments 
    : appointments.filter(app => app.status === statusFilter)

  // Sort appointments by date (most recent first)
  const sortedAppointments = [...filteredAppointments].sort((a, b) => 
    new Date(b.appointmentDate) - new Date(a.appointmentDate)
  )

  if (loading) {
    return <div className="spinner"></div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1>My Appointments</h1>
        
        {user.role === 'patient' && (
          <Link to="/appointments/new" className="button">
            New Appointment
          </Link>
        )}
      </div>
      
      {error && <div className="alert alert-error">{error}</div>}
      
      <div className="card">
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <label htmlFor="statusFilter">Filter by Status</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={handleStatusChange}
          >
            <option value="all">All Appointments</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        
        {sortedAppointments.length === 0 ? (
          <div className="text-center">
            <p>No appointments found.</p>
            {user.role === 'patient' && (
              <Link to="/appointments/new" className="button mt-4">
                Book an Appointment
              </Link>
            )}
          </div>
        ) : (
          <div>
            {sortedAppointments.map(appointment => (
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
                    <p><strong>Doctor:</strong> Dr. {appointment.doctorId.userId.firstName} {appointment.doctorId.userId.lastName} ({appointment.doctorId.specialization})</p>
                  ) : (
                    <p><strong>Patient:</strong> {appointment.patientId.userId.firstName} {appointment.patientId.userId.lastName}</p>
                  )}
                </div>
                
                <p><strong>Reason:</strong> {appointment.reason}</p>
                
                {appointment.notes && (
                  <p><strong>Notes:</strong> {appointment.notes}</p>
                )}
                
                {appointment.status === 'scheduled' && (
                  <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
                    {user.role === 'doctor' && (
                      <button 
                        className="button" 
                        onClick={() => openUpdateModal(appointment)}
                      >
                        Update Status
                      </button>
                    )}
                    
                    <button 
                      className="button button-secondary" 
                      onClick={() => handleCancelAppointment(appointment._id)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Update Appointment Modal (for Doctors) */}
      {activeAppointment && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: 'var(--space-6)',
            borderRadius: 'var(--radius-lg)',
            width: '90%',
            maxWidth: '500px'
          }}>
            <h2>Update Appointment</h2>
            
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <p>
                <strong>Patient:</strong> {activeAppointment.patientId.userId.firstName} {activeAppointment.patientId.userId.lastName}
              </p>
              <p>
                <strong>Date:</strong> {new Date(activeAppointment.appointmentDate).toLocaleDateString()} at {activeAppointment.appointmentTime}
              </p>
              <p>
                <strong>Reason:</strong> {activeAppointment.reason}
              </p>
            </div>
            
            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="4"
                placeholder="Add notes about the appointment..."
              ></textarea>
            </div>
            
            <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
              <button
                className="button"
                style={{ flex: 1 }}
                onClick={() => handleUpdateAppointment('completed')}
              >
                Mark as Completed
              </button>
              
              <button
                className="button button-secondary"
                style={{ flex: 1 }}
                onClick={closeUpdateModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AppointmentsList