import { Button } from '@/components/ui/button'
import { SignInButton } from '@clerk/clerk-react'
import { createFileRoute } from '@tanstack/react-router'
import { Authenticated, Unauthenticated } from 'convex/react'

export const Route = createFileRoute('/')({
  component: Home,
  loader: ({ context }) => context?.user,
})

function Home() {
  const user = Route.useLoaderData()
  
  return (
    <>
      <Authenticated>
        <p>Logged with: <strong>{user?.fullName ?? '---'}</strong></p>
      </Authenticated>

      <div className="p-2">
        <h3>Welcome Home!</h3>
      </div>

      <Unauthenticated>
        <div className="flex justify-center">
          <SignInButton mode="modal">
            <Button>Sign in</Button>
          </SignInButton>
        </div>
      </Unauthenticated>
    </>
  )
}
