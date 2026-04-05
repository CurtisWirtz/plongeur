import Logout from '@/components/Logout'
import { Link } from '@tanstack/react-router'
import { useAuth } from '@/hooks/useAuth'

const Header = () => {
  const { data: user, isLoading } = useAuth()

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #eee' }}>
      <nav>
        <Link to="/" className="font-bold">Plongeur</Link>
      </nav>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {isLoading ? (
          <span>Loading...</span>
        ) : user ? (
          <>
            {/* Display the user data from your Django UserSerializer */}
            <span>Hi, {user.email}</span> 
            <Logout />
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </header>
  )
}

export default Header