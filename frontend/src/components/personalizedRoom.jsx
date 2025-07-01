import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Users, Send, Moon, Sun, UserX, PhoneOff, Crown } from 'lucide-react';
import { io } from "socket.io-client";
import { useParams } from 'react-router-dom';
import useThemeStore from '../store/themeStore';
import useUserStore from '../store/userStore';
import { useLocation } from "react-router-dom";
const PersonalizedChat = () => {
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [totalOnline, setTotalOnline] = useState(0);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const location = useLocation();
  const { user, admin } = useUserStore();
  const { darkMode, toggleDarkMode } = useThemeStore();
  
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const hasJoinedRef = useRef(false);
  const {roomId} = useParams();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // 🔥 FIX 1: Removed 'admin' from dependencies to prevent reconnections
  useEffect(() => {
    if (!user?.name) {
      return;
    }

    if (socketRef.current?.connected) {
      return;
    }

    socketRef.current = io("http://localhost:5000", {});

    const socket = socketRef.current;

    socket.on("connect", () => {
      setIsConnected(true);
      if (!hasJoinedRef.current) {
        socket.emit("join-room", { 
          roomId,
          userName: user.name,
          userId: user.email,
          isAdmin: admin,
        });
        hasJoinedRef.current = true;
      }
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      hasJoinedRef.current = false;
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setIsConnected(false);
    });

    socket.on("new-message", (messageData) => {
      setMessages((prev) => {
        const isDuplicate = prev.some(msg => msg.id === messageData.id);
        if (isDuplicate) return prev;
        
        return [
          ...prev,
          {
            id: messageData.id,
            sender: messageData.sender,
            message: messageData.message,
            timestamp: messageData.timestamp,
            type: messageData.userId === (user.userId || user.email) ? "user" : messageData.type,
            userId: messageData.userId,
          },
        ];
      });
    });

    socket.on("chat-history", (chatHistory) => {
      setMessages(chatHistory.map(msg => ({
        ...msg,
        type: msg.userId === (user.userId || user.email) ? "user" : msg.type
      })));
    });

    socket.on("online-users-updated", ({ users, totalOnline }) => {
      setOnlineUsers(users);
      setTotalOnline(totalOnline);
    });

    socket.on("removed-from-room", ({ roomId }) => {
      setIsConnected(false);
      alert('You have been removed from the chat');
    });

    socket.on("meeting-ended", ({ roomId }) => {
      setIsConnected(false);
      alert('Meeting has been ended');
    });

    return () => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("leave-room", { roomId, userId: user.email });
      socketRef.current.disconnect();
    }
    hasJoinedRef.current = false;
};
}, [user?.name, user?.email, roomId, location.pathname]); 

  const sendMessage = useCallback(() => {
    if (!newMessage.trim() || !socketRef.current?.connected) return;

    const messageData = {
      roomId,
      message: newMessage.trim(),
      sender: user.name,
      userId: user.email,
      type: 'user'
    };

    socketRef.current.emit("send-message", messageData);
    setNewMessage('');
  }, [newMessage, user, roomId]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

 
  const removeUser = useCallback((targetUserId) => {
    if (!admin || !socketRef.current?.connected) return;

    socketRef.current.emit("remove-user", { 
      roomId,
      targetUserId,
      adminUserId: user.email 
    });
  }, [admin, roomId, user]);

  const endMeeting = useCallback(() => {
    if (!admin || !socketRef.current?.connected) return;
    
    socketRef.current.emit("end-meeting", { 
      roomId,
      adminUserId: user.email  
    });
  }, [admin, roomId, user, ]);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isMyMessage = (message) => {
    return  (message.userId ===user.email);
  };

  const renderMessage = (message) => {
    if (message.type === 'system') {
      return (
        <div key={message.id} className="flex justify-center my-4">
          <div className={`text-sm px-4 py-2 rounded-full border transition-colors duration-200 ${
            darkMode 
              ? "bg-slate-800 text-slate-300 border-slate-700" 
              : "bg-blue-50 text-blue-600 border-blue-200"
          }`}>
            {message.message}
          </div>
        </div>
      );
    }

    const isMyMsg = isMyMessage(message);

return (
  <div
    key={message.id}
    className={`flex ${isMyMsg ? "justify-end" : "justify-start"} mb-4`}
  >
    <div className={`max-w-xs lg:max-w-md ${isMyMsg ? "ml-12" : "mr-12"}`}>
      <div
        className={`px-4 py-3 rounded-2xl transition-all duration-200 ${
          isMyMsg
            ? darkMode
              ? "bg-indigo-600 text-white rounded-br-md shadow-lg"
              : "bg-blue-500 text-white rounded-br-md shadow-md"
            : darkMode
            ? "bg-slate-800 text-slate-100 rounded-bl-md shadow-lg border border-slate-700"
            : "bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-200"
        }`}
      >
        {/* Sender name inside the bubble */}
        <div
          className={`text-xs font-medium mb-1 ${
            isMyMsg
              ? darkMode
                ? "text-indigo-100"
                : "text-blue-100"
              : darkMode
              ? "text-slate-400"
              : "text-gray-500"
          }`}
        >
          {isMyMsg ? "You" : message.sender}
        </div>

        {/* Message text */}
        <div className="break-words text-sm leading-relaxed">
          {message.message}
        </div>

        {/* Time */}
        <div
          className={`text-xs mt-1 ${
            isMyMsg
              ? darkMode
                ? "text-indigo-200"
                : "text-blue-100"
              : darkMode
              ? "text-slate-400"
              : "text-gray-400"
          }`}
        >
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  </div>
);
};

  return (
    <div className={`h-screen flex transition-colors duration-300 ${
      darkMode ? "bg-slate-900" : "bg-gray-50"
    }`}>
      {/* Sidebar - Online Users */}
      <div className={`w-80 border-r flex flex-col transition-colors duration-300 ${
        darkMode 
          ? "bg-slate-800 border-slate-700" 
          : "bg-white border-gray-200"
      }`}>
        <div className={`p-6 border-b transition-colors duration-300 ${
          darkMode ? "border-slate-700" : "border-gray-200"
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-bold text-lg transition-colors duration-200 ${
              darkMode ? "text-slate-100" : "text-gray-800"
            }`}>
              Online Users
            </h3>
            <div className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
              darkMode ? "bg-emerald-900 text-emerald-200" : "bg-emerald-100 text-emerald-800"
            }`}>
              {totalOnline}
            </div>
          </div>
          
          {admin && (
            <button
              onClick={endMeeting}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 transform hover:scale-105 font-medium"
            >
              <PhoneOff className="w-4 h-4" />
              End Meeting
            </button>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {onlineUsers.map((userItem) => (
              <div key={userItem.userId} className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                darkMode ? "hover:bg-slate-700" : "hover:bg-gray-50"
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className={`text-sm font-medium transition-colors duration-200 ${
                    darkMode ? "text-slate-200" : "text-gray-700"
                  }`}>
                    {userItem.userName}
                  </span>
                  {userItem.isAdmin && <Crown className="w-4 h-4 text-yellow-500" />}
                </div>
                {admin && userItem.userId !== (user.userId || user.email) && (
                  <button
                    onClick={() => removeUser(userItem.userId)}
                    className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                      darkMode 
                        ? "text-red-400 hover:bg-red-900/20" 
                        : "text-red-500 hover:bg-red-50"
                    }`}
                  >
                    <UserX className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <header className={`shadow-lg border-b px-6 py-4 transition-colors duration-300 ${
          darkMode 
            ? "bg-slate-800 border-slate-700 shadow-slate-900/50" 
            : "bg-white border-gray-200 shadow-gray-200/50"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-200 ${
                darkMode ? "bg-slate-700" : "bg-gray-100"
              }`}>
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold tracking-tight transition-colors duration-200 ${
                  darkMode ? "text-slate-100" : "text-gray-800"
                }`}>
                  Chat Room
                </h1>
                <div className={`text-sm font-medium transition-colors duration-200 ${
                  darkMode ? "text-slate-400" : "text-gray-500"
                }`}>
                  Personalized Chat
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    isConnected ? "bg-emerald-500 animate-pulse" : "bg-red-500"
                  }`}
                />
                <span className={`text-sm font-medium transition-colors duration-200 ${
                  darkMode ? "text-slate-300" : "text-gray-600"
                }`}>
                  {isConnected ? "Online" : "Offline"}
                </span>
              </div>

              <button
                onClick={toggleDarkMode}
                className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                  darkMode 
                    ? "bg-slate-700 hover:bg-slate-600 text-yellow-400" 
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                }`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-6xl mb-6 animate-bounce">💬</div>
                <div className={`text-2xl font-bold mb-3 transition-colors duration-200 ${
                  darkMode ? "text-slate-200" : "text-gray-700"
                }`}>
                  Welcome to Chat Room
                </div>
                <div className={`text-lg transition-colors duration-200 ${
                  darkMode ? "text-slate-400" : "text-gray-500"
                }`}>
                  Start the conversation by sending a message
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-1 max-w-4xl mx-auto">
              {messages.map(renderMessage)}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className={`border-t p-6 transition-colors duration-300 ${
          darkMode 
            ? "bg-slate-800 border-slate-700" 
            : "bg-white border-gray-200"
        }`}>
          <div className="flex items-center space-x-4 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <input
                className={`w-full rounded-2xl px-6 py-4 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  darkMode
                    ? "bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400 focus:ring-indigo-500 focus:ring-offset-slate-800 focus:border-indigo-500"
                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:ring-offset-white focus:border-blue-500"
                } ${!isConnected ? "opacity-50 cursor-not-allowed" : ""}`}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type a message..."
                disabled={!isConnected}
                maxLength={500}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim() || !isConnected}
              className={`p-4 rounded-2xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                darkMode
                  ? "bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-600 focus:ring-indigo-500 focus:ring-offset-slate-800 text-white shadow-lg"
                  : "bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 focus:ring-blue-500 focus:ring-offset-white text-white shadow-md"
              } ${(!newMessage.trim() || !isConnected) ? "opacity-50 cursor-not-allowed transform-none" : ""}`}
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedChat;