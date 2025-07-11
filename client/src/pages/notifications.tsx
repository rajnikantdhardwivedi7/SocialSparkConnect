import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import NavigationHeader from "@/components/navigation-header";
import MobileNavigation from "@/components/mobile-navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/queryClient";
import type { NotificationWithDetails } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

export default function Notifications() {
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery<NotificationWithDetails[]>({
    queryKey: ["/api/notifications"],
  });

  const followMutation = useMutation({
    mutationFn: async (userId: string) => {
      await apiRequest("POST", `/api/users/${userId}/follow`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
  });

  const handleFollow = (userId: string) => {
    followMutation.mutate(userId);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationHeader />
      
      <main className="pb-16 md:pb-0">
        <div className="max-w-lg mx-auto pt-6">
          <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="font-semibold text-lg">Notifications</h2>
            </div>
            
            {isLoading ? (
              <div className="space-y-4 p-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                    <Skeleton className="w-10 h-10" />
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <h3 className="text-lg font-semibold mb-2">No notifications yet</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  When someone likes or comments on your posts, you'll see it here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {notifications.map((notification) => (
                  <div key={notification.id} className="p-4 flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage 
                        src={notification.fromUser?.profileImageUrl} 
                        alt={notification.fromUser?.username} 
                      />
                      <AvatarFallback>
                        {notification.fromUser?.firstName?.[0]}
                        {notification.fromUser?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-semibold">
                          {notification.fromUser?.username}
                        </span>{' '}
                        <span>{notification.message}</span>
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(notification.createdAt!), { addSuffix: true })}
                      </p>
                    </div>
                    
                    {notification.type === 'follow' ? (
                      <Button 
                        size="sm"
                        onClick={() => handleFollow(notification.fromUserId!)}
                        disabled={followMutation.isPending}
                        className="bg-blue-500 text-white hover:bg-blue-600"
                      >
                        Follow
                      </Button>
                    ) : notification.post && (
                      <img 
                        src={notification.post.imageUrl}
                        alt="Post thumbnail" 
                        className="w-10 h-10 object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <MobileNavigation />
    </div>
  );
}
