import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import NavigationHeader from "@/components/navigation-header";
import MobileNavigation from "@/components/mobile-navigation";
import PhotoGrid from "@/components/photo-grid";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { PostWithDetails } from "@shared/schema";
import { Search } from "lucide-react";

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: posts = [], isLoading } = useQuery<PostWithDetails[]>({
    queryKey: ["/api/posts/explore"],
  });

  const filteredPosts = posts; // TODO: Add search functionality

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationHeader />
      
      <main className="pb-16 md:pb-0">
        <div className="max-w-4xl mx-auto p-4">
          {/* Search Bar Mobile */}
          <div className="md:hidden mb-4">
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
              <Search className="w-4 h-4 text-gray-500 mr-3" />
              <Input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-0 outline-none flex-1"
              />
            </div>
          </div>

          {/* Photo Grid */}
          {isLoading ? (
            <div className="grid grid-cols-3 gap-1">
              {[...Array(12)].map((_, i) => (
                <Skeleton key={i} className="aspect-square" />
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">No posts found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try searching for something else or check back later.
              </p>
            </div>
          ) : (
            <PhotoGrid posts={filteredPosts} />
          )}
        </div>
      </main>

      <MobileNavigation />
    </div>
  );
}
