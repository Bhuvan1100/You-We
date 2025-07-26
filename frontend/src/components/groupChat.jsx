import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import useUserStore from "../store/userStore";
import useThemeStore from "../store/themeStore";

const GroupRoom = () => {
  const { topic } = useParams();
  const { user } = useUserStore();
  const {darkMode, toggleDarkMode} = useThemeStore();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const hasJoinedRef = useRef(false);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!user?.name) {
      navigate("/");
      return;
    }

    if (socketRef.current?.connected){
      return;
    }

    socketRef.current = io(import.meta.env.VITE_BASE_URL, {
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      setIsConnected(true);
      if (!hasJoinedRef.current) {
        socket.emit("join-group", { topic, user });
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

    
    socket.on("group-message", ({ sender, text, timestamp, messageId }) => {
      setMessages((prev) => {
        const isDuplicate = prev.some(msg => msg.id === messageId);
        if (isDuplicate) return prev;
        
        return [
          ...prev,
          {
            id: messageId || `msg-${Date.now()}-${Math.random()}`,
            sender,
            text,
            timestamp: timestamp || new Date().toISOString(),
            type: "message",
          },
        ];
      });
    });

    
    socket.on("user-joined", ({ user: joinedUser, timestamp, messageId }) => {
      setMessages((prev) => {
        const isDuplicate = prev.some(msg => msg.id === messageId);
        if (isDuplicate) return prev;
        
        return [
          ...prev,
          {
            id: messageId,
            text: `${joinedUser.name} joined the group`,
            timestamp: timestamp || new Date().toISOString(),
            type: "notification",
          },
        ];
      });
    });

    
    socket.on("user-left", ({ user: leftUser, timestamp, messageId }) => {
      setMessages((prev) => {
        
        
        return [
          ...prev,
          {
            id: messageId,
            text: `${leftUser.name} left the group`,
            timestamp: timestamp || new Date().toISOString(),
            type: "notification",
          },
        ];
      });
    });

   
    return () => {
      if (socket.connected) {
        socket.emit("leave-group", { topic, user });
        socket.disconnect();
      }
      hasJoinedRef.current = false;
    };
  }, [topic, user, navigate]);

  const sendMessage = useCallback(() => {
    if (input.trim() && socketRef.current?.connected) {
      const messageData = {
        topic,
        text: input.trim(),
        sender: user.name,
        timestamp: new Date().toISOString(),
        messageId: `msg-${Date.now()}-${Math.random()}`,
      };

      socketRef.current.emit("group-message", messageData);
      setInput("");
    }
  }, [input, topic, user]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderMessage = (msg) => {
    
    if (msg.type === "notification") {
      return (
        <div key={msg.id} className="flex justify-center my-4">
          <div className={`text-sm px-4 py-2 rounded-full border transition-colors duration-200 ${
            darkMode 
              ? "bg-slate-800 text-slate-300 border-slate-700" 
              : "bg-blue-50 text-blue-600 border-blue-200"
          }`}>
            {msg.text}
          </div>
        </div>
      );
    }

    
    const isMyMessage = msg.sender === user?.name;

    return (
      <div
        key={msg.id}
        className={`flex ${isMyMessage ? "justify-end" : "justify-start"} mb-4`}
      >
        <div className={`max-w-xs lg:max-w-md ${isMyMessage ? "ml-12" : "mr-12"}`}>
          {/* Show sender name for other people's messages */}
          {!isMyMessage && (
            <div className={`text-xs mb-1 px-1 transition-colors duration-200 ${
              darkMode ? "text-slate-400" : "text-gray-500"
            }`}>
              {msg.sender}
            </div>
          )}
          <div
            className={`px-4 py-3 rounded-2xl transition-all duration-200 ${
              isMyMessage
                ? darkMode
                  ? "bg-indigo-600 text-white rounded-br-md shadow-lg"
                  : "bg-blue-500 text-white rounded-br-md shadow-md"
                : darkMode
                ? "bg-slate-800 text-slate-100 rounded-bl-md shadow-lg border border-slate-700"
                : "bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-200"
            }`}
          >
            <div className="break-words text-sm leading-relaxed">{msg.text}</div>
            <div
              className={`text-xs mt-1 transition-colors duration-200 ${
                isMyMessage 
                  ? darkMode 
                    ? "text-indigo-200" 
                    : "text-blue-100"
                  : darkMode 
                  ? "text-slate-400" 
                  : "text-gray-400"
              }`}
            >
              {formatTime(msg.timestamp)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`h-screen flex flex-col transition-colors duration-300 ${
      darkMode ? "bg-slate-900" : "bg-gray-50"
    }`}>
      {/* Header */}
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
              <span className="text-2xl">💬</span>
            </div>
            <div>
              <h1 className={`text-2xl font-bold tracking-tight transition-colors duration-200 ${
                darkMode ? "text-slate-100" : "text-gray-800"
              }`}>
                {topic}
              </h1>
              <div className={`text-sm font-medium transition-colors duration-200 ${
                darkMode ? "text-slate-400" : "text-gray-500"
              }`}>
                Group Chat
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Connection Status */}
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

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                darkMode 
                  ? "bg-slate-700 hover:bg-slate-600 text-yellow-400" 
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600"
              }`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-6xl mb-6 animate-bounce">💬</div>
              <div className={`text-2xl font-bold mb-3 transition-colors duration-200 ${
                darkMode ? "text-slate-200" : "text-gray-700"
              }`}>
                Welcome to {topic}
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

      {/* Input */}
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
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              disabled={!isConnected}
              maxLength={500}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!input.trim() || !isConnected}
            className={`p-4 rounded-2xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              darkMode
                ? "bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-600 focus:ring-indigo-500 focus:ring-offset-slate-800 text-white shadow-lg"
                : "bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 focus:ring-blue-500 focus:ring-offset-white text-white shadow-md"
            } ${(!input.trim() || !isConnected) ? "opacity-50 cursor-not-allowed transform-none" : ""}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupRoom;