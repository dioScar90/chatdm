import { useUser } from '@clerk/clerk-react'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { useConvexAuth } from 'convex/react'
import { NavbarMenu } from '@/components/ui/navbar-menu'

type MyRouterContext = {
  isAuthenticated: ReturnType<typeof useConvexAuth>['isAuthenticated']
  user: ReturnType<typeof useUser>['user']
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Root,
})

function Root() {
  return (
    <>
      <NavbarMenu />

      <hr />
      
      <main className="container max-w-2xl flex flex-col gap-8">
        <h1 className="text-4xl font-extrabold my-8 text-center main-header-of-page">
          ChatMD
        </h1>
        
        <Outlet />
      </main>
      
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}
