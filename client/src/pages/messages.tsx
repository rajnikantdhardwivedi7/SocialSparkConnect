import NavigationHeader from "@/components/navigation-header";
import MobileNavigation from "@/components/mobile-navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, MessageCircle } from "lucide-react";

export default function Messages() {
  // Mock conversations for now
  const mockConversations = [
    {
      id: 1,
      user: {
        username: "emma_art",
        profileImageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      },
      lastMessage: "Hey! Love your latest post 🔥",
      timestamp: "2m",
      unread: true,
    },
    {
      id: 2,
      user: {
        username: "alex_photo",
        profileImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      },
      lastMessage: "Thanks for the follow!",
      timestamp: "1h",
      unread: false,
    },
    {
      id: 3,
      user: {
        username: "mike_dev",
        profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      },
      lastMessage: "The hiking photos are amazing!",
      timestamp: "3h",
      unread: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationHeader />
      
      <main className="pb-16 md:pb-0">
        <div className="max-w-lg mx-auto pt-6">
          <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <h2 className="font-semibold text-lg">Direct Messages</h2>
              <Button variant="ghost" size="sm">
                <Edit className="w-5 h-5" />
              </Button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <Input
                type="text"
                placeholder="Search messages..."
                className="w-full"
              />
            </div>
            
            {/* Conversations List */}
            {mockConversations.length === 0 ? (
              <div className="p-8 text-center">
                <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Your Messages</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Send private photos and messages to a friend or group.
                </p>
                <Button>Send Message</Button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {mockConversations.map((conversation) => (
                  <div 
                    key={conversation.id} 
                    className="p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  >
                    <Avatar className="w-12 h-12">
                      <AvatarImage 
                        src={conversation.user.profileImageUrl} 
                        alt={conversation.user.username} 
                      />
                      <AvatarFallback>
                        {conversation.user.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {conversation.user.username}
                      </p>
                      <p className={`text-sm truncate ${
                        conversation.unread 
                          ? 'text-black dark:text-white font-medium' 
                          : 'text-gray-500'
                      }`}>
                        {conversation.lastMessage}
                      </p>
                    </div>
                    
                    <div className="text-right flex flex-col items-end">
                      <p className="text-xs text-gray-500">{conversation.timestamp}</p>
                      {conversation.unread && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                      )}
                    </div>
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
