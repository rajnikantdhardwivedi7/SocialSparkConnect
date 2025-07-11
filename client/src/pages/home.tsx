import { useQuery } from "@tanstack/react-query";
import NavigationHeader from "@/components/navigation-header";
import MobileNavigation from "@/components/mobile-navigation";
import StoriesSection from "@/components/stories-section";
import PostCard from "@/components/post-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { PostWithDetails } from "@shared/schema";

export default function Home() {
  const { data: posts = [], isLoading } = useQuery<PostWithDetails[]>({
    queryKey: ["/api/posts/feed"],
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationHeader />
      
      <main className="pb-16 md:pb-0">
        <div className="max-w-lg mx-auto pt-6">
          <StoriesSection />

          {/* Feed Posts */}
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="w-full aspect-square rounded" />
                  <div className="space-y-2 mt-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-8 text-center">
              <h3 className="text-lg font-semibold mb-2">Welcome to Instagram!</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Start following people to see their posts in your feed.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </main>

      <MobileNavigation />
    </div>
  );
}
