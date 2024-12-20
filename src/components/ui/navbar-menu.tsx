import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Bell, Menu as MenuIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { UserButton } from "@clerk/clerk-react";
import { Authenticated } from "convex/react";

export function NavbarMenu() {
  return (
    <nav className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <MobileMenuButton />

          <LogoAndLinks />
          
          <NotificationAndProfile />
        </div>
      </div>
    </nav>
  );
}

type MenuLinkProps = {
  mobile: boolean
  to: '/' | '/chat' | '/about'
  name: string
}

function MenuLink({ mobile, to, name }: MenuLinkProps) {
  return (
    <Link
      to={to}
      className={cn(
        "text-gray-300 hover:bg-gray-700 hover:text-white",
        "[&.active]:bg-gray-900 [&.active]:text-white",
        mobile
          ? "block rounded-md px-3 py-2 text-base font-medium"
          : "rounded-md px-3 py-2 text-sm font-medium",
      )}
    >
      {name}
    </Link>
  )
}

function MenuLinkList({ mobile }: { mobile?: boolean }) {
  return (
    <>
      <MenuLink mobile={!!mobile} to="/" name="Home" />

      <Authenticated>
        <MenuLink mobile={!!mobile} to="/chat" name="Chat" />
        <MenuLink mobile={!!mobile} to="/about" name="About" />
      </Authenticated>
    </>
  )
}

function MobileMenuButton() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-4">
          <div className="space-y-1">
            <MenuLinkList mobile />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

function LogoAndLinks() {
  return (
    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
      <div className="flex shrink-0 items-center">
        <img
          src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
          alt="Logo"
          className="h-8 w-auto"
        />
      </div>
      <div className="hidden sm:ml-6 sm:block">
        <div className="flex space-x-4">
        <MenuLinkList />
        </div>
      </div>
    </div>
  )
}

function NotificationAndProfile() {
  return (
    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
        <Bell className="w-6 h-6" />
      </Button>
      
      <UserButton afterSignOutUrl="/" />
    </div>
  )
}
