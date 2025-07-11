import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import type { StoryWithUser } from "@shared/schema";
import { Plus } from "lucide-react";

export default function StoriesSection() {
  const { user } = useAuth();
  
  const { data: stories = [] } = useQuery<StoryWithUser[]>({
    queryKey: ["/api/stories"],
  });

  return (
    <section className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg mb-6 p-4">
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {/* Current User Story - Add Story */}
        <div className="flex flex-col items-center space-y-1 flex-shrink-0">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-full p-0.5">
              <div className="bg-white dark:bg-black rounded-full p-0.5 w-full h-full">
                <Avatar className="w-full h-full">
                  <AvatarImage src={user?.profileImageUrl} alt="Your story" />
                  <AvatarFallback>
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
            <Button
              size="sm"
              className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-blue-500 hover:bg-blue-600 p-0"
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
          <span className="text-xs text-gray-600 dark:text-gray-400 text-center">
            Your story
          </span>
        </div>

        {/* Friends' Stories */}
        {stories.map((story) => (
          <div key={story.id} className="flex flex-col items-center space-y-1 flex-shrink-0">
            <div className="w-16 h-16 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-full p-0.5">
              <div className="bg-white dark:bg-black rounded-full p-0.5 w-full h-full">
                <Avatar className="w-full h-full">
                  <AvatarImage src={story.user.profileImageUrl} alt={`${story.user.username} story`} />
                  <AvatarFallback>
                    {story.user.firstName?.[0]}{story.user.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400 text-center max-w-[64px] truncate">
              {story.user.username}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
