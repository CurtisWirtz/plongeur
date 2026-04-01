import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: () => (
    <>
      <h1>Plongeur</h1>
      <p>Welcome to Plongeur! This is the frontend.</p>
    </>
  ),
})