import { ClerkProvider, useAuth, useUser } from "@clerk/clerk-react";
import { ConvexReactClient, useConvexAuth } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "./ErrorBoundary";
import "./index.css";
import { RouterProvider, createRouter } from "@tanstack/react-router"

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
const router = createRouter({
  routeTree,
  context: undefined!,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <ClerkProvider publishableKey={clerkPubKey}>
          <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            <RouterProviderWithAuthContext />
          </ConvexProviderWithClerk>
        </ClerkProvider>
      </ErrorBoundary>
    </StrictMode>
  )
}

function RouterProviderWithAuthContext() {
  const { isAuthenticated } = useConvexAuth()
  const { user } = useUser()
  return <RouterProvider router={router} context={{ isAuthenticated, user }} />
}
