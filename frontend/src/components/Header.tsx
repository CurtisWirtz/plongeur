import Logout from '@/components/Logout'
import { Link } from '@tanstack/react-router'
import { useAuth } from '@/hooks/useAuth'
import type { User } from '@/types/user.types'

const Header = () => {
  const { data: user } = useAuth() as { data: User | null }

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #eee' }}>
      <nav>
        <Link to="/" className="font-bold">Plongeur</Link>
      </nav>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {user ? (
          <>
            {/* Display the user data from your Django UserSerializer */}
            <Link to="/dashboard" className="font-bold">
              <span>Hi, {user.email}</span>
            </Link>
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