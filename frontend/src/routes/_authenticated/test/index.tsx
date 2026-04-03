import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/test/')({
  component: () => <div>Hello "/_authenticated/test/"!</div>,
})
