import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/patients_fixed')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/patients_fixed"!</div>
}
