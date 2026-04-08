import { Link, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({
  component: () => (
    <>
      <h1>Plongeur</h1>
      <p>Welcome to Plongeur! This is the frontend.</p>
      <Button asChild variant="default" size="lg">
        <Link to="/dashboard">Go to Dashboard</Link>
      </Button>
      
    </>
  ),
})