import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Home = () => {
  const { user } = useAuth()

  return (
    <div>
      <section className="card" style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
        <h1>Welcome to Hospital Management System</h1>
        <p style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-6)' }}>
          Providing quality healthcare services and easy appointment booking
        </p>
        
        {!user ? (
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' }}>
            <Link to="/login" className="button button-secondary">Login</Link>
            <Link to="/register" className="button">Register Now</Link>
          </div>
        ) : (
          <Link to="/dashboard" className="button">Go to Dashboard</Link>
        )}
      </section>
      
      <section style={{ marginTop: 'var(--space-10)' }}>
        <h2>Our Services</h2>
        <div className="grid grid-cols-1 grid-cols-md-3" style={{ gap: 'var(--space-6)' }}>
          <div className="card">
            <h3>Find Doctors</h3>
            <p>Browse our network of experienced and qualified doctors across various specializations.</p>
            <Link to="/doctors" className="button button-secondary">View Doctors</Link>
          </div>
          
          <div className="card">
            <h3>Book Appointments</h3>
            <p>Schedule appointments with your preferred doctors at your convenient time.</p>
            <Link to={user ? "/appointments/new" : "/login"} className="button button-secondary">
              {user ? "Book Appointment" : "Login to Book"}
            </Link>
          </div>
          
          <div className="card">
            <h3>Manage Health Records</h3>
            <p>Keep track of your medical history and appointments in one place.</p>
            <Link to={user ? "/profile" : "/login"} className="button button-secondary">
              {user ? "View Profile" : "Login to View"}
            </Link>
          </div>
        </div>
      </section>
      
      <section style={{ marginTop: 'var(--space-10)' }}>
        <h2>Why Choose Us</h2>
        <div className="grid grid-cols-1 grid-cols-md-2" style={{ gap: 'var(--space-6)' }}>
          <div className="card">
            <h3>Experienced Doctors</h3>
            <p>Our hospital boasts a team of highly qualified and experienced doctors across various specializations.</p>
          </div>
          
          <div className="card">
            <h3>Easy Appointment Booking</h3>
            <p>Book appointments with just a few clicks and manage your schedule effortlessly.</p>
          </div>
          
          <div className="card">
            <h3>24/7 Support</h3>
            <p>Our dedicated support team is available round the clock to assist you with any queries.</p>
          </div>
          
          <div className="card">
            <h3>Digital Health Records</h3>
            <p>Access your health records anytime, anywhere through our secure digital platform.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home