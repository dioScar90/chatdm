import { Button } from '@/components/ui/button'
import { SignInButton, useUser } from '@clerk/clerk-react'
import { Link, Outlet, createRootRouteWithContext, useLoaderData } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Authenticated, Unauthenticated, useConvexAuth } from 'convex/react'

type MyRouterContext = {
  isAuthenticated: ReturnType<typeof useConvexAuth>['isAuthenticated']
  user: ReturnType<typeof useUser>['user']
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Root,
  loader: ({ context }) => context?.user
})

function Root() {
  const user = useLoaderData({ from: '__root__' })

  return (
    <>
      <div className="p-2 flex gap-2 text-lg">
        <Link
          to="/"
          className="[&.active]:font-bold"
        >
          Home
        </Link>
        <Authenticated>
          <Link
            to="/chat"
            className="[&.active]:font-bold"
          >
            Chat
          </Link>
          <Link
            to="/about"
            className="[&.active]:font-bold"
          >
            About
          </Link>
        </Authenticated>
      </div>

      <hr />
      
      <main className="container max-w-2xl flex flex-col gap-8">
        <h1 className="text-4xl font-extrabold my-8 text-center">
          Convex + React (Vite) + Clerk Auth
        </h1>
        {user && (
          <p>Logged with: <strong>{user.fullName}</strong></p>
        )}
        <Authenticated>
          <Outlet />
        </Authenticated>
        <Unauthenticated>
          <div className="flex justify-center">
            <SignInButton mode="modal">
              <Button>Sign in</Button>
            </SignInButton>
          </div>
        </Unauthenticated>
      </main>
      
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}
