import { Button } from '@/components/ui/button'
import { SignInButton } from '@clerk/clerk-react'
import { Link, Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Authenticated, Unauthenticated, useConvexAuth } from 'convex/react'

type MyRouterContext = ReturnType<typeof useConvexAuth>

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Root,
})

function Root() {
  return (
    <>
      <div className="p-2 flex gap-2 text-lg">
        <Link
          to="/"
          className="[&.active]:font-bold"
        >
          Home
        </Link>{' '}
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
      <Main />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}

function Main() {
  return (
    <main className="container max-w-2xl flex flex-col gap-8">
      <h1 className="text-4xl font-extrabold my-8 text-center">
        Convex + React (Vite) + Clerk Auth
      </h1>
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
  );
}
