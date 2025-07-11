import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { UserWithCounts } from "@shared/schema";
import { Settings, UserPlus } from "lucide-react";

interface ProfileHeaderProps {
  user: UserWithCounts;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isOwnProfile = currentUser?.id === user.id;

  const followMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/users/${user.id}/follow`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", user.username] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to follow user",
        variant: "destructive",
      });
    },
  });

  const handleFollow = () => {
    followMutation.mutate();
  };

  return (
    <div className="flex items-start space-x-8 mb-8 p-4">
      {/* Profile Picture */}
      <Avatar className="w-32 h-32">
        <AvatarImage src={user.profileImageUrl} alt={user.username} />
        <AvatarFallback className="text-4xl">
          {user.firstName?.[0]}{user.lastName?.[0]}
        </AvatarFallback>
      </Avatar>

      {/* Profile Info */}
      <div className="flex-1">
        <div className="flex items-center space-x-4 mb-4">
          <h2 className="text-2xl font-light">{user.username}</h2>
          {isOwnProfile ? (
            <>
              <Button variant="outline" className="font-semibold">
                Edit Profile
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-5 h-5" />
              </Button>
            </>
          ) : (
            <Button 
              onClick={handleFollow}
              disabled={followMutation.isPending}
              className={`font-semibold ${
                user.isFollowing 
                  ? 'bg-gray-200 text-black hover:bg-gray-300' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {user.isFollowing ? 'Following' : 'Follow'}
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="flex space-x-8 mb-4">
          <span>
            <strong>{user.postCount.toLocaleString()}</strong> posts
          </span>
          <span>
            <strong>{user.followerCount.toLocaleString()}</strong> followers
          </span>
          <span>
            <strong>{user.followingCount.toLocaleString()}</strong> following
          </span>
        </div>

        {/* Bio */}
        <div>
          {(user.firstName || user.lastName) && (
            <h3 className="font-semibold">
              {user.firstName} {user.lastName}
            </h3>
          )}
          {user.bio && (
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
              {user.bio}
            </p>
          )}
          {user.website && (
            <a 
              href={user.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {user.website}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
