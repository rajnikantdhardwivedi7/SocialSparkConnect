import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Instagram, Camera, Heart, MessageCircle, Share } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 rounded-full flex items-center justify-center">
              <Instagram className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-600 bg-clip-text text-transparent mb-4">
            Instagram Clone
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Share your moments, connect with friends, and discover amazing content in a beautiful, 
            Instagram-inspired social media experience.
          </p>
          
          <Button 
            onClick={() => window.location.href = '/api/login'}
            className="bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 hover:from-purple-600 hover:via-pink-600 hover:to-yellow-600 text-white font-semibold py-4 px-8 text-lg rounded-full transition-all duration-300 transform hover:scale-105"
          >
            Get Started
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
          <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Share Photos</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Upload and share your favorite moments with beautiful photo filters and editing tools.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Follow friends, like posts, and engage with content from people you care about.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Discover</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Explore trending content, discover new creators, and find inspiration every day.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8">Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold mb-2">Stories</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">24-hour disappearing content</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold mb-2">Reels</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Short-form video content</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold mb-2">Messages</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Direct messaging with friends</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Share className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold mb-2">Explore</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Discover trending content</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Made with ❤️ by <strong>Rajnikant Dhardwivedi</strong>
          </p>
          <div className="flex justify-center space-x-6 mt-4 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300">About</a>
            <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300">Privacy</a>
            <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300">Terms</a>
            <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300">Help</a>
          </div>
          <p className="text-xs text-gray-400 mt-4">© 2024 Instagram Clone</p>
        </div>
      </footer>
    </div>
  );
}
