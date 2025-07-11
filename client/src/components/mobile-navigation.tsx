import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { 
  Home, 
  Search, 
  Film, 
  Heart, 
  User
} from "lucide-react";

export default function MobileNavigation() {
  const [location] = useLocation();
  const { user } = useAuth();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/explore", icon: Search, label: "Search" },
    { path: "/reels", icon: Film, label: "Reels" },
    { path: "/notifications", icon: Heart, label: "Activity" },
    { 
      path: `/profile/${user?.username}`, 
      icon: () => (
        <Avatar className="h-6 w-6">
          <AvatarImage src={user?.profileImageUrl} alt={user?.username} />
          <AvatarFallback>
            <User className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      ), 
      label: "Profile" 
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 z-50">
      <div className="flex justify-around py-2">
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
                className={`p-3 ${isActive ? 'text-pink-600' : 'text-gray-600 dark:text-gray-400'}`}
              >
                <Icon className="w-6 h-6" />
              </Button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
