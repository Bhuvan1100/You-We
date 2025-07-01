import React, { useState } from "react";
import { Users, Shield, Palette, Eye, Lock, Zap, Moon, Sun } from "lucide-react";
import useThemeStore from "../store/themeStore";
import useUserStore from "../store/userStore";
import { useNavigate } from "react-router-dom";

const RoomPage = () => {
  const [roomName, setRoomName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [errors, setErrors] = useState({});
  const { darkMode, toggleDarkMode } = useThemeStore();
  const { setAdmin } = useUserStore();
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    if (!roomName.trim() || roomName.trim().length < 3) {
      setErrors(prev => ({ ...prev, roomName: "Must be at least 3 characters" }));
      return;
    }

    setIsCreating(true);
    const randomId = Math.random().toString(36).substr(2, 6);
    const cleanTopic = roomName.trim().replace(/\s+/g, "-");
    const generatedRoomID = `${randomId}-${cleanTopic}`;
    setAdmin(true);
    navigate(`/chat/personalizedroom/${generatedRoomID}`);
  };

  const handleJoinRoom = async () => {
    if (!roomId.trim() || roomId.trim().length < 3) {
      setErrors(prev => ({ ...prev, roomId: "Must be at least 3 characters" }));
      return;
    }

    setIsJoining(true);
    setAdmin(false);
    navigate(`/chat/personalizedroom/${roomId}`);
  };

  const features = [
    { icon: <Users className="w-6 h-6" />, title: "Live Online Status", description: "See who's online and active in real-time with dynamic presence indicators" },
    { icon: <Palette className="w-6 h-6" />, title: "Custom Room Design", description: "Personalize your room with themes, colors, and custom backgrounds" },
    { icon: <Shield className="w-6 h-6" />, title: "Admin Powers", description: "Full moderation tools including kick, ban, and permission management" },
    { icon: <Eye className="w-6 h-6" />, title: "Privacy Controls", description: "Advanced privacy settings with room visibility and access controls" },
    { icon: <Lock className="w-6 h-6" />, title: "Secure Encryption", description: "End-to-end encryption ensures your conversations stay private" },
    { icon: <Zap className="w-6 h-6" />, title: "Lightning Fast", description: "Optimized performance with instant message delivery and sync" }
  ];

  const themeClasses = darkMode
    ? "min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800"
    : "min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500";

  const cardClasses = darkMode
    ? "w-full max-w-6xl bg-black bg-opacity-80 border border-gray-800 rounded-2xl shadow-2xl backdrop-blur-sm"
    : "w-full max-w-6xl bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-2xl";

  const inputClasses = darkMode
    ? "w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
    : "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200";

  return (
    <div className={themeClasses}>
      <div className="flex items-center justify-center p-4 min-h-screen">
        <div className={cardClasses}>
          <div className={`p-6 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
            <div className="flex justify-between items-center">
              <div>
                <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Room Central
                </h1>
                <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Create or join rooms for seamless collaboration
                </p>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`p-3 rounded-full transition-all duration-200 ${
                  darkMode 
                    ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400 border border-gray-700' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
              </button>
            </div>
          </div>

          <div className="p-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Left Side - Room Actions */}
              <div className="space-y-8">
                {/* Create Room */}
                <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-900 bg-opacity-70 border border-gray-800' : 'bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200'}`}>
                  <div className="text-center">
                    <div className="mb-4">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-indigo-600'} mb-4`}>
                        <Users className="w-8 h-8 text-white" />
                      </div>
                      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-indigo-700'} mb-2`}>
                        Create Your Room
                      </h2>
                    </div>
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Enter Room Name"
                        className={inputClasses}
                        value={roomName}
                        onChange={(e) => {
                          setRoomName(e.target.value);
                          if (errors.roomName) setErrors(prev => ({ ...prev, roomName: null }));
                        }}
                        maxLength={50}
                        disabled={isCreating}
                      />
                      {errors.roomName && <p className="text-red-500 text-sm">{errors.roomName}</p>}
                      <button
                        className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:opacity-50 ${
                          darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                        onClick={handleCreateRoom}
                        disabled={isCreating || !roomName.trim()}
                      >
                        {isCreating ? "Creating Room..." : "Create Room"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Join Room */}
                <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700 bg-opacity-50' : 'bg-gradient-to-r from-pink-50 to-rose-50'} border ${darkMode ? 'border-gray-600' : 'border-pink-200'}`}>
                  <div className="text-center">
                    <div className="mb-4">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${darkMode ? 'bg-pink-600' : 'bg-pink-500'} mb-4`}>
                        <Lock className="w-8 h-8 text-white" />
                      </div>
                      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-pink-600'} mb-2`}>
                        Join Existing Room
                      </h2>
                    </div>
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Enter Room ID"
                        className={inputClasses}
                        value={roomId}
                        onChange={(e) => {
                          setRoomId(e.target.value);
                          if (errors.roomId) setErrors(prev => ({ ...prev, roomId: null }));
                        }}
                        maxLength={50}
                        disabled={isJoining}
                      />
                      {errors.roomId && <p className="text-red-500 text-sm">{errors.roomId}</p>}
                      <button
                        className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:opacity-50 ${
                          darkMode ? 'bg-pink-600 hover:bg-pink-700 text-white' : 'bg-pink-500 hover:bg-pink-600 text-white'
                        }`}
                        onClick={handleJoinRoom}
                        disabled={isJoining || !roomId.trim()}
                      >
                        {isJoining ? "Joining Room..." : "Join Room"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Features */}
              <div>
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>
                  🚀 Room Features
                </h3>
                <div className="grid gap-4">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border transition-all duration-200 hover:transform hover:scale-105 ${
                        darkMode
                          ? 'bg-gray-700 bg-opacity-30 border-gray-600 hover:bg-gray-600 hover:bg-opacity-50'
                          : 'bg-white bg-opacity-70 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`flex-shrink-0 p-2 rounded-lg ${
                          darkMode ? 'bg-blue-600' : 'bg-indigo-100'
                        }`}>
                          <div className={darkMode ? 'text-white' : 'text-indigo-600'}>
                            {feature.icon}
                          </div>
                        </div>
                        <div>
                          <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} mb-1`}>
                            {feature.title}
                          </h4>
                          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
