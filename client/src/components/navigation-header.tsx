import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/components/theme-provider";
import { 
  Search, 
  Home, 
  Compass, 
  Film, 
  Send, 
  Heart, 
  PlusSquare,
  Menu,
  Sun,
  Moon,
  LogOut
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function NavigationHeader() {
  const [location] = useLocation();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/explore", icon: Compass, label: "Explore" },
    { path: "/reels", icon: Film, label: "Reels" },
    { path: "/messages", icon: Send, label: "Messages" },
    { path: "/notifications", icon: Heart, label: "Notifications" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-600 bg-clip-text text-transparent cursor-pointer">
            Instagram
          </h1>
        </Link>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 flex-1 max-w-xs mx-8">
          <Search className="w-4 h-4 text-gray-500 mr-3" />
          <Input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-0 outline-none flex-1 text-sm"
          />
        </div>

        {/* Navigation Icons */}
        <nav className="flex items-center space-x-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path || 
              (item.path === "/" && location === "/") ||
              (item.path !== "/" && location.startsWith(item.path));
            
            return (
              <Link key={item.path} href={item.path}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`p-2 ${isActive ? 'text-pink-600' : 'text-gray-600 dark:text-gray-400'}`}
                >
                  <Icon className="w-6 h-6" />
                </Button>
              </Link>
            );
          })}

          <Button variant="ghost" size="sm" className="p-2">
            <PlusSquare className="w-6 h-6" />
          </Button>

          {/* Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profileImageUrl} alt={user?.username} />
                  <AvatarFallback>
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem asChild>
                <Link href={`/profile/${user?.username}`} className="flex items-center">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={user?.profileImageUrl} alt={user?.username} />
                    <AvatarFallback>
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                {theme === "dark" ? "Light mode" : "Dark mode"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.location.href = '/api/logout'}>
                <LogOut className="w-4 h-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
}
