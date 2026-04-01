import Logout from '@/components/Logout'
import { Link } from '@tanstack/react-router'

const Header = () => {
  return (
    <header className="flex justify-between">
        <div className="">
            <Link to="/">Plongeur</Link>
        </div>
        <div className="flex">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Logout />
        </div>
    </header>

  )
}

export default Header