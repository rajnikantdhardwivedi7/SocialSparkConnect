import { useState } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import NavigationHeader from "@/components/navigation-header";
import MobileNavigation from "@/components/mobile-navigation";
import ProfileHeader from "@/components/profile-header";
import PhotoGrid from "@/components/photo-grid";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { UserWithCounts, PostWithDetails } from "@shared/schema";
import { Grid3X3, Bookmark, Tags } from "lucide-react";

export default function Profile() {
  const [, params] = useRoute("/profile/:username");
  const [activeTab, setActiveTab] = useState<"posts" | "saved" | "tagged">("posts");
  
  const { data: user, isLoading: userLoading } = useQuery<UserWithCounts>({
    queryKey: ["/api/users", params?.username],
    enabled: !!params?.username,
  });

  const { data: posts = [], isLoading: postsLoading } = useQuery<PostWithDetails[]>({
    queryKey: ["/api/users", params?.username, "posts"],
    enabled: !!params?.username,
  });

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <NavigationHeader />
        <main className="pb-16 md:pb-0">
          <div className="max-w-4xl mx-auto p-4">
            <div className="flex items-start space-x-8 mb-8">
              <Skeleton className="w-32 h-32 rounded-full" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>
        </main>
        <MobileNavigation />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <NavigationHeader />
        <main className="pb-16 md:pb-0">
          <div className="max-w-4xl mx-auto p-4 text-center py-12">
            <h2 className="text-2xl font-bold mb-2">User not found</h2>
            <p className="text-gray-600 dark:text-gray-400">
              The user you're looking for doesn't exist.
            </p>
          </div>
        </main>
        <MobileNavigation />
      </div>
    );
  }

  const tabs = [
    { id: "posts" as const, icon: Grid3X3, label: "POSTS", count: user.postCount },
    { id: "saved" as const, icon: Bookmark, label: "SAVED", count: 0 },
    { id: "tagged" as const, icon: Tags, label: "TAGGED", count: 0 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationHeader />
      
      <main className="pb-16 md:pb-0">
        <div className="max-w-4xl mx-auto">
          <ProfileHeader user={user} />

          {/* Profile Navigation */}
          <div className="border-t border-gray-200 dark:border-gray-800 mb-6">
            <nav className="flex justify-center space-x-16">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    variant="ghost"
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 font-semibold text-sm ${
                      activeTab === tab.id
                        ? 'border-t border-black dark:border-white text-black dark:text-white'
                        : 'text-gray-500'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </Button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="px-4">
            {activeTab === "posts" && (
              <>
                {postsLoading ? (
                  <div className="grid grid-cols-3 gap-1">
                    {[...Array(9)].map((_, i) => (
                      <Skeleton key={i} className="aspect-square" />
                    ))}
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      When {user.username} shares photos, they'll appear here.
                    </p>
                  </div>
                ) : (
                  <PhotoGrid posts={posts} />
                )}
              </>
            )}

            {activeTab === "saved" && (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">Saved posts</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Coming soon! Save posts to view them here.
                </p>
              </div>
            )}

            {activeTab === "tagged" && (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">Tagged posts</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Coming soon! Posts where {user.username} is tagged will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <MobileNavigation />
    </div>
  );
}
