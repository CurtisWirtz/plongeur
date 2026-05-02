import Logout from '@/components/Logout'
import { Link } from '@tanstack/react-router'
import { useAuth } from '@/hooks/useAuth'
import type { User } from '@/types/user.types'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

import { UserRound } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from './ui/button'

const Header = () => {
  const { data: user } = useAuth() as { data: User | null }

  return (
    <header className="w-full sticky top-0 bg-primary-foreground">
      <nav className="flex justify-between w-full border-b px-3 md:px-7 border-accent pt-2 pb-3">
        <Link to="/" className="font-bold flex items-center">
          <h1>Plongeur</h1>
        </Link>
      
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer">
            <Avatar className="shadow-2xl border">
              <AvatarFallback>
                <UserRound />
              </AvatarFallback>
            </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="space-y-2 w-full text-center -translate-x-7">
              <DropdownMenuLabel >{user.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild >
                <Button asChild variant="ghost" className="w-full cursor-pointer">
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Logout />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div>
            <Button asChild variant="ghost">
                <Link to="/register" activeProps={{ className: "bg-secondary dark:text-popover hover:dark:text-primary shadow-2xl" }}>
                Register
              </Link>
            </Button>
            <Button asChild variant="ghost">
                <Link to="/login" activeProps={{ className: "bg-secondary dark:text-popover hover:dark:text-primary shadow-2xl" }}>
                Login
              </Link>
            </Button>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header