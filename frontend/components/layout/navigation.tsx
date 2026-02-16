

'use client'

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, X, Camera, User, Settings, LayoutDashboard, LogOut } from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useCurrentUser, useLogout } from '@/lib/hooks';
import { toast } from 'sonner';



export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  


    const {data} = useCurrentUser() 

  const pathname = usePathname();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Logged out successfully");
      },
      onError: () => {
        toast.error("Failed to log out. Please try again.");
      }
    });
  };

 

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Camera className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">Headshot</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className={`transition-colors ${
                pathname === '/'
                  ? 'text-primary font-medium' 
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/pricing" 
              className={`transition-colors ${
                pathname === '/pricing'
                  ? 'text-primary font-medium' 
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              Pricing
            </Link>
            <Link 
              href="/about" 
              className={`transition-colors ${
                pathname === '/about'
                  ? 'text-primary font-medium' 
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className={`transition-colors ${
                pathname === '/contact'
                  ? 'text-primary font-medium' 
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Auth Buttons / User Profile - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {data?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={data.user.image} alt={data.user.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {data.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{data.user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {data.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" className="text-foreground">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-foreground"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <Link 
                href="/" 
                className={`py-2 transition-colors ${
                  pathname === '/' 
                    ? 'text-primary font-medium' 
                    : 'text-muted-foreground hover:text-primary'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/pricing" 
                className={`py-2 transition-colors ${
                    pathname === '/pricing'
                    ? 'text-primary font-medium' 
                    : 'text-muted-foreground hover:text-primary'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link 
                href="/about" 
                className={`py-2 transition-colors ${
                    pathname === '/about'
                    ? 'text-primary font-medium' 
                    : 'text-muted-foreground hover:text-primary'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className={`py-2 transition-colors ${
                    pathname === '/contact'
                    ? 'text-primary font-medium' 
                    : 'text-muted-foreground hover:text-primary'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              
              <div className="pt-4 border-t border-border">
                {data?.user ? (
                  <div className="space-y-3">
                    {/* User Info */}
                    <div className="flex items-center gap-3 px-2 py-3 bg-secondary/50 rounded-lg">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={data.user.image} alt={data.user.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {data.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">{data.user.name}</span>
                        <span className="text-xs text-muted-foreground">{data.user.email}</span>
                      </div>
                    </div>
                    
                    {/* User Menu Items */}
                    <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full justify-start">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Button>
                    </Link>
                    <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full justify-start">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Button>
                    </Link>
                    <Link href="/settings" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full justify-start">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50"
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link href="/auth/register" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                        Register
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}