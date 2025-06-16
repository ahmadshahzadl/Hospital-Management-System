import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllDoctors, getDoctorsBySpecialization } from '../../services/doctorService'

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [specialization, setSpecialization] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  
  const specializations = [
    'Cardiology',
    'Dermatology',
    'Endocrinology',
    'Gastroenterology',
    'Neurology',
    'Oncology',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry',
    'Radiology',
    'Urology'
  ]

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true)
        let data
        
        if (specialization) {
          data = await getDoctorsBySpecialization(specialization)
        } else {
          data = await getAllDoctors()
        }
        
        setDoctors(data.doctors)
        setError(null)
      } catch (err) {
        console.error('Error fetching doctors:', err)
        setError('Failed to load doctors. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [specialization])

  const handleSpecializationChange = (e) => {
    setSpecialization(e.target.value)
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const filteredDoctors = doctors.filter(doctor => {
    const fullName = `${doctor.userId.firstName} ${doctor.userId.lastName}`.toLowerCase()
    return fullName.includes(searchQuery.toLowerCase())
  })

  if (loading) {
    return <div className="spinner"></div>
  }

  return (
    <div>
      <h1>Our Doctors</h1>
      
      <div className="card">
        <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label htmlFor="specialization">Filter by Specialization</label>
            <select
              id="specialization"
              value={specialization}
              onChange={handleSpecializationChange}
            >
              <option value="">All Specializations</option>
              {specializations.map(spec => (
                <option key={spec} value={spec.toLowerCase()}>{spec}</option>
              ))}
            </select>
          </div>
          
          <div style={{ flex: '2', minWidth: '200px' }}>
            <label htmlFor="search">Search by Name</label>
            <input
              type="text"
              id="search"
              placeholder="Search doctors..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        {!error && filteredDoctors.length === 0 && (
          <div className="text-center">
            <p>No doctors found matching your criteria.</p>
          </div>
        )}
        
        <div className="doctor-grid">
          {filteredDoctors.map(doctor => (
            <div key={doctor._id} className="doctor-card">
              <div className="doctor-info">
                <h3 className="doctor-name">
                  Dr. {doctor.userId.firstName} {doctor.userId.lastName}
                </h3>
                <div className="doctor-specialization">
                  {doctor.specialization}
                </div>
                <div className="doctor-detail">
                  <span>Experience:</span> {doctor.experience} years
                </div>
                <div className="doctor-detail">
                  <span>Qualification:</span> {doctor.qualification}
                </div>
                <Link to={`/doctors/${doctor._id}`} className="button mt-4 w-full">
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DoctorsList