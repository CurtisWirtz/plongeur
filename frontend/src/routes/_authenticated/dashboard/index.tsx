import { createFileRoute } from '@tanstack/react-router'
import TestComponent from './test'



export const Route = createFileRoute('/_authenticated/dashboard/')({
  component: TestComponent,
})
