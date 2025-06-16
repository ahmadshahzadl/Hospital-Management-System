import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: 'var(--space-10)' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" className="button mt-4">
        Go to Home
      </Link>
    </div>
  )
}

export default NotFound