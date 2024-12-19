// import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/clerk-react";
import { createFileRoute, redirect, useLoaderData } from "@tanstack/react-router";

export const Route = createFileRoute('/about')({
  component: About,
  beforeLoad({ context }) {
    if (!context.isAuthenticated) {
      return redirect({ to: '/', replace: true })
    }
  },
  loader: ({ context }) => context?.user!
})

function About() {
  const user = useLoaderData({ from: '/about' })
  
  return (
    <>
      <p>Welcome {user?.firstName}!</p>
      <p className="flex gap-4 items-center">
        This is you:
        <UserButton afterSignOutUrl="/" />
      </p>
      <p>
        Click the button below and open this page in another window - this data
        is persisted in the Convex cloud database!
      </p>
      <p>
        Edit{" "}
        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
          convex/myFunctions.ts
        </code>{" "}
        to change your backend
      </p>
      <p>
        Edit{" "}
        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
          src/App.tsx
        </code>{" "}
        to change your frontend
      </p>
      <p>
        Check out{" "}
        <a
          className="font-medium text-primary underline underline-offset-4"
          target="_blank"
          href="https://docs.convex.dev/home"
        >
          Convex docs
        </a>
      </p>
    </>
  );
}
