import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { House } from 'lucide-react';

const notFoundComponent = () => {
  return (
    <section className="container w-full h-full">
        <header className="max-w-100 w-full mx-auto my-16 flex flex-col items-center">
            <h1 className="text-2xl text-center mb-7">Lost! 404 error</h1>
            <Button asChild variant="secondary" className="cursor-pointer shadow-2xl">
                <Link to="/dashboard" className="border-none"><House />Take me home!</Link>
            </Button>
        </header>
    </section>
  )
}

export default notFoundComponent