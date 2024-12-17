import { Link, Outlet, createRootRoute, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

type MyRouterContext = {
  isAuthenticated: boolean
  user: { id: number }
}

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
        <Link
          to="/chat"
          className="[&.active]:font-bold"
        >
          Chat
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}
