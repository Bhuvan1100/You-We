import React, { useState } from "react";
import { MessageCircle, Users, ChevronRight, Home, Moon, Sun, LogOut, User } from "lucide-react";
import useUserStore from "../store/userStore";
import useThemeStore from "../store/themeStore";
import { useNavigate } from "react-router-dom";
import RoomPage from "../components/roomPage";
const Main = () => {
 
  const {user} = useUserStore();
  const {darkMode, toggleDarkMode} = useThemeStore();

  
  const navigate = useNavigate();

  const handleNavigation = (type) => {
    if (type === "one") {
     navigate("/chat/one-to-one-chat")
    } else if (type === "group") {
      navigate("/chat/group")
    } else if (type === "room") {
      navigate("/chat/roomPage");
    }
  };

  const handleDashboard = () => {
    console.log("Navigating to /dashboard");
  };

  const handleLogout = () => {
    console.log("Logging out...");
  };

  return (
    <div className={`min-h-screen ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800' 
        : 'bg-gray-50'
    }`}>
      {/* Header */}
      <header className={`${
        darkMode ? 'bg-slate-800/80 border-slate-700/50 backdrop-blur-sm' : 'bg-white/80 border-gray-200 backdrop-blur-sm'
      } border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* User Profile */}
            <button
              onClick={handleDashboard}
              className={`flex items-center space-x-3 px-4 py-2 rounded-xl transition-all duration-200 ${
                darkMode 
                  ? 'hover:bg-slate-700/60 text-white' 
                  : 'hover:bg-gray-100 text-gray-900'
              }`}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className={`text-sm font-semibold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {user?.name || "User"}
                </div>
                <div className={`text-xs ${
                  darkMode ? 'text-slate-400' : 'text-gray-500'
                }`}>
                  {user?.email}
                </div>
              </div>
            </button>

            {/* Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleDarkMode}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  darkMode 
                    ? 'text-slate-300 hover:text-white hover:bg-slate-700/60' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <button
                onClick={handleLogout}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  darkMode 
                    ? 'text-slate-300 hover:text-red-400 hover:bg-slate-700/60' 
                    : 'text-gray-500 hover:text-red-600 hover:bg-gray-100'
                }`}
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className={`text-3xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600">
              {user?.name?.split(' ')[0] || "Friend"}
            </span>
          </h1>
          <p className={`mt-2 text-lg ${
            darkMode ? 'text-slate-300' : 'text-gray-600'
          }`}>
            Choose how you'd like to connect and communicate
          </p>
        </div>

        {/* Chat Options */}
        <div className="grid gap-6 md:grid-cols-3">
          
          <div 
            onClick={() => handleNavigation("one")}
            className={`group relative cursor-pointer rounded-xl p-6 transition-all hover:scale-105 ${
              darkMode 
                ? 'bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50' 
                : 'bg-white hover:bg-gray-50 border border-gray-200'
            } shadow-sm hover:shadow-lg backdrop-blur-sm`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    One-to-One Chat
                  </h3>
                  <div className={`text-sm space-y-1 ${
                    darkMode ? 'text-slate-300' : 'text-gray-600'
                  }`}>
                    <p>• Private, secure conversations</p>
                    <p>• Direct messaging with individuals</p>
                    <p>• Perfect for personal discussions</p>
                  </div>
                </div>
              </div>
              <ChevronRight className={`h-5 w-5 transition-transform group-hover:translate-x-1 ${
                darkMode ? 'text-slate-400' : 'text-gray-400'
              }`} />
            </div>
          </div>

          {/* Group Chat */}
          <div 
            onClick={() => handleNavigation("group")}
            className={`group relative cursor-pointer rounded-xl p-6 transition-all hover:scale-105 ${
              darkMode 
                ? 'bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50' 
                : 'bg-white hover:bg-gray-50 border border-gray-200'
            } shadow-sm hover:shadow-lg backdrop-blur-sm`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Group Chat
                  </h3>
                  <div className={`text-sm space-y-1 ${
                    darkMode ? 'text-slate-300' : 'text-gray-600'
                  }`}>
                    <p>• Connect with multiple people</p>
                    <p>• Team collaboration and planning</p>
                    <p>• Share ideas in group discussions</p>
                  </div>
                </div>
              </div>
              <ChevronRight className={`h-5 w-5 transition-transform group-hover:translate-x-1 ${
                darkMode ? 'text-slate-400' : 'text-gray-400'
              }`} />
            </div>
          </div>

          {/* Personalized Room */}
          <div 
            onClick={() => handleNavigation("room")}
            className={`group relative cursor-pointer rounded-xl p-6 transition-all hover:scale-105 ${
              darkMode 
                ? 'bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50' 
                : 'bg-white hover:bg-gray-50 border border-gray-200'
            } shadow-sm hover:shadow-lg backdrop-blur-sm`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-violet-600 shadow-lg">
                  <Home className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Custom Room
                  </h3>
                  <div className={`text-sm space-y-1 ${
                    darkMode ? 'text-slate-300' : 'text-gray-600'
                  }`}>
                    <p>• Create your personalized space</p>
                    <p>• Custom themes and settings</p>
                    <p>• Control invites and permissions</p>
                  </div>
                </div>
              </div>
              <ChevronRight className={`h-5 w-5 transition-transform group-hover:translate-x-1 ${
                darkMode ? 'text-slate-400' : 'text-gray-400'
              }`} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Main;