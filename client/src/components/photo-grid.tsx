import { useState } from "react";
import type { PostWithDetails } from "@shared/schema";
import { Heart, MessageCircle } from "lucide-react";

interface PhotoGridProps {
  posts: PostWithDetails[];
  onPostClick?: (post: PostWithDetails) => void;
}

export default function PhotoGrid({ posts, onPostClick }: PhotoGridProps) {
  return (
    <div className="grid grid-cols-3 gap-1">
      {posts.map((post) => (
        <div 
          key={post.id} 
          className="aspect-square relative cursor-pointer group"
          onClick={() => onPostClick?.(post)}
        >
          <img 
            src={post.imageUrl} 
            alt="Post content" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
            <div className="text-white opacity-0 group-hover:opacity-100 flex items-center space-x-4">
              <span className="flex items-center">
                <Heart className="w-5 h-5 mr-1 fill-current" />
                {post.likeCount > 0 ? post.likeCount.toLocaleString() : 0}
              </span>
              <span className="flex items-center">
                <MessageCircle className="w-5 h-5 mr-1 fill-current" />
                {post.commentCount > 0 ? post.commentCount.toLocaleString() : 0}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
