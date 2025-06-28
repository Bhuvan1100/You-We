import React, { useEffect } from "react";
import { MessageCircle, Users, ChevronRight, Sparkles } from "lucide-react";
import useUserStore from "../store/userStore";
import { useNavigate } from "react-router-dom";
const Main = () => {
  
  const {user} = useUserStore()
  const navigate = useNavigate()
   const handleNavigation = (type) => {
    if (type === "one") navigate("/chat/one-to-one-chat");
    else navigate("/chat/group");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header with user info */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-800 dark:text-white">ChatApp</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Connect & Collaborate</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.name || "User"}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Welcome section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6 shadow-lg">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">{user?.name?.split(' ')[0] || "Friend"}</span>!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose how you'd like to connect and start meaningful conversations that matter.
          </p>
        </div>

        {/* Chat options */}
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* One-to-One Chat */}
          <div 
            onClick={() => handleNavigation("one")}
            className="group cursor-pointer bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">One-to-One Chat</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Have private, focused conversations with individuals. Perfect for personal discussions and direct communication.
            </p>
            <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium text-sm">
              Start chatting
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          {/* Group Chat */}
          <div 
            onClick={() => handleNavigation("group")}
            className="group cursor-pointer bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="w-7 h-7 text-white" />
              </div>
              <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all duration-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Group Chat</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Connect with multiple people at once. Great for team discussions, planning, and collaborative conversations.
            </p>
            <div className="flex items-center text-green-600 dark:text-green-400 font-medium text-sm">
              Join group
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </div>

        {/* Stats or additional info */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="text-center p-6 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">24/7</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Always Available</div>
          </div>
          <div className="text-center p-6 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">Secure</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">End-to-End Encrypted</div>
          </div>
          <div className="text-center p-6 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">Fast</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Instant Messaging</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;