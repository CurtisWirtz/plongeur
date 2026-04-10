import useLogout from '@/hooks/useLogout'
import { Button } from './ui/button'


export function Logout() {
  const { mutate, isPending } = useLogout()

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault() // Stop the page from reloading on form submission, we'll manually redirect on success
    mutate()
  }

  return (
    <form onSubmit={handleSubmit}>
      <Button 
        type="submit" 
        variant="ghost"
        disabled={isPending}
        className="w-full text-center"
      >
        Logout
      </Button>
    </form>
  )
}

export default Logout