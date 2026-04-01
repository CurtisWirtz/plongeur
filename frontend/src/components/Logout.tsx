import useLogout from '@/hooks/useLogout'


export function Logout() {
  const { mutate, isPending } = useLogout()

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault() // Stop the page from reloading on form submission, we'll manually redirect on success
    mutate()
  }

  return (
    <form onSubmit={handleSubmit}>
      <button 
        type="submit" 
        disabled={isPending}
        className="text-red-500 hover:text-red-700 font-medium cursor-pointer"
      >
        {isPending ? 'Logging out...' : 'Logout'}
      </button>
    </form>
  )
}

export default Logout