import NavigationHeader from "@/components/navigation-header";
import MobileNavigation from "@/components/mobile-navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Send, Bookmark, Play } from "lucide-react";

export default function Reels() {
  // Mock data for now
  const mockReel = {
    id: 1,
    videoUrl: "", // Would be a video URL
    thumbnailUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=800",
    creator: {
      username: "alex_photo",
      profileImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    },
    caption: "Urban exploration at its finest 🏢 #citylife #photography #reels",
    likes: 1200,
    comments: 89,
  };

  return (
    <div className="min-h-screen bg-black">
      <NavigationHeader />
      
      <main className="pb-16 md:pb-0">
        <div className="max-w-lg mx-auto h-screen relative">
          {/* Reels Video Player */}
          <div className="w-full h-full bg-black relative">
            {/* Video placeholder */}
            <div className="w-full h-full bg-gray-900 flex items-center justify-center relative">
              <img 
                src={mockReel.thumbnailUrl}
                alt="Reels content" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <Button
                variant="ghost"
                size="lg"
                className="absolute inset-0 flex items-center justify-center hover:bg-transparent"
              >
                <Play className="w-16 h-16 text-white opacity-80" />
              </Button>
            </div>
            
            {/* Reels UI Overlay */}
            <div className="absolute right-4 bottom-20 flex flex-col items-center space-y-6">
              <Button variant="ghost" className="text-white flex flex-col items-center p-2">
                <Heart className="w-8 h-8 mb-1" />
                <span className="text-xs">{mockReel.likes.toLocaleString()}</span>
              </Button>
              
              <Button variant="ghost" className="text-white flex flex-col items-center p-2">
                <MessageCircle className="w-8 h-8 mb-1" />
                <span className="text-xs">{mockReel.comments}</span>
              </Button>
              
              <Button variant="ghost" className="text-white flex flex-col items-center p-2">
                <Send className="w-8 h-8 mb-1" />
                <span className="text-xs">Share</span>
              </Button>
              
              <Button variant="ghost" className="text-white p-2">
                <Bookmark className="w-8 h-8" />
              </Button>
            </div>
            
            {/* Creator Info */}
            <div className="absolute bottom-20 left-4 right-20">
              <div className="flex items-center space-x-3 mb-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={mockReel.creator.profileImageUrl} alt={mockReel.creator.username} />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <span className="text-white font-semibold">{mockReel.creator.username}</span>
                <Button 
                  variant="outline"
                  size="sm"
                  className="text-white border-white bg-transparent hover:bg-white hover:text-black"
                >
                  Follow
                </Button>
              </div>
              <p className="text-white text-sm">{mockReel.caption}</p>
            </div>
          </div>
        </div>
      </main>

      <MobileNavigation />
    </div>
  );
}
