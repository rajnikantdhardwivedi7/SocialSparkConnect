import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { PostWithDetails } from "@shared/schema";
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  MoreHorizontal 
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface PostCardProps {
  post: PostWithDetails;
}

export default function PostCard({ post }: PostCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);

  const likeMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/posts/${post.id}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts/feed"] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts/explore"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to like post",
        variant: "destructive",
      });
    },
  });

  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      await apiRequest("POST", `/api/posts/${post.id}/comments`, { content });
    },
    onSuccess: () => {
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["/api/posts/feed"] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts/explore"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    },
  });

  const handleLike = () => {
    likeMutation.mutate();
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      commentMutation.mutate(comment.trim());
    }
  };

  const visibleComments = showAllComments ? post.comments : post.comments.slice(0, 2);

  return (
    <article className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg mb-6">
      {/* Post Header */}
      <header className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={post.user.profileImageUrl} alt={post.user.username} />
            <AvatarFallback>
              {post.user.firstName?.[0]}{post.user.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <span className="font-semibold text-sm">{post.user.username}</span>
            {post.location && (
              <p className="text-xs text-gray-500">{post.location}</p>
            )}
          </div>
        </div>
        <Button variant="ghost" size="sm" className="p-1">
          <MoreHorizontal className="w-5 h-5" />
        </Button>
      </header>

      {/* Post Image */}
      <div className="relative">
        <img 
          src={post.imageUrl} 
          alt="Post content" 
          className="w-full aspect-square object-cover"
        />
      </div>

      {/* Post Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-0 hover:bg-transparent"
              onClick={handleLike}
              disabled={likeMutation.isPending}
            >
              <Heart 
                className={`w-6 h-6 ${post.isLiked ? 'fill-red-500 text-red-500' : 'text-gray-700 dark:text-gray-300'}`} 
              />
            </Button>
            <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent">
              <MessageCircle className="w-6 h-6" />
            </Button>
            <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent">
              <Send className="w-6 h-6" />
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent">
            <Bookmark className="w-6 h-6" />
          </Button>
        </div>

        {/* Like Count */}
        {post.likeCount > 0 && (
          <p className="font-semibold text-sm mb-1">
            {post.likeCount.toLocaleString()} {post.likeCount === 1 ? 'like' : 'likes'}
          </p>
        )}

        {/* Caption */}
        {post.caption && (
          <p className="text-sm mb-2">
            <span className="font-semibold">{post.user.username}</span>{' '}
            <span>{post.caption}</span>
          </p>
        )}

        {/* Comments */}
        {post.commentCount > 0 && (
          <>
            {post.commentCount > 2 && !showAllComments && (
              <button
                onClick={() => setShowAllComments(true)}
                className="text-gray-500 text-sm mb-2 hover:text-gray-700 dark:hover:text-gray-300"
              >
                View all {post.commentCount} comments
              </button>
            )}
            
            <div className="space-y-1 mb-2">
              {visibleComments.map((comment) => (
                <p key={comment.id} className="text-sm">
                  <span className="font-semibold">{comment.user.username}</span>{' '}
                  <span>{comment.content}</span>
                </p>
              ))}
            </div>
          </>
        )}

        {/* Timestamp */}
        <p className="text-gray-400 text-xs mb-3">
          {formatDistanceToNow(new Date(post.createdAt!), { addSuffix: true })}
        </p>

        {/* Add Comment */}
        <form onSubmit={handleComment} className="flex items-center space-x-2 border-t border-gray-200 dark:border-gray-800 pt-3">
          <Input
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="flex-1 border-0 bg-transparent text-sm placeholder:text-gray-500"
          />
          {comment.trim() && (
            <Button 
              type="submit" 
              variant="ghost" 
              size="sm" 
              className="text-blue-500 hover:text-blue-600 p-0"
              disabled={commentMutation.isPending}
            >
              Post
            </Button>
          )}
        </form>
      </div>
    </article>
  );
}
