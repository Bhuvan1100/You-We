// pages/GroupRoom.jsx
import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import useUserStore from "../store/userStore";

const GroupRoom = () => {
  const { topic } = useParams();
  const { user } = useUserStore();
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

    if (socketRef.current?.connected) {
      return;
    }

    socketRef.current = io("http://localhost:5000", {
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

    // Handle regular chat messages
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

    // Handle user join notifications
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

    // Handle user leave notifications
    socket.on("user-left", ({ user: leftUser, timestamp, messageId }) => {
      setMessages((prev) => {
        const isDuplicate = prev.some(msg => msg.id === messageId);
        if (isDuplicate) return prev;
        
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

    // Cleanup on unmount
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
    // Join/Leave notifications - CENTERED
    if (msg.type === "notification") {
      return (
        <div key={msg.id} className="flex justify-center my-4">
          <div className="bg-blue-50 text-blue-600 text-sm px-4 py-2 rounded-full border border-blue-200">
            {msg.text}
          </div>
        </div>
      );
    }

    // Regular messages - MY messages on RIGHT, others on LEFT
    const isMyMessage = msg.sender === user?.name;

    return (
      <div
        key={msg.id}
        className={`flex ${isMyMessage ? "justify-end" : "justify-start"} mb-4`}
      >
        <div className={`max-w-xs lg:max-w-md ${isMyMessage ? "ml-12" : "mr-12"}`}>
          {/* Show sender name for other people's messages */}
          {!isMyMessage && (
            <div className="text-xs text-gray-500 mb-1 px-1">
              {msg.sender}
            </div>
          )}
          <div
            className={`px-4 py-3 rounded-2xl ${
              isMyMessage
                ? "bg-blue-500 text-white rounded-br-md"
                : "bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-200"
            }`}
          >
            <div className="break-words text-sm">{msg.text}</div>
            <div
              className={`text-xs mt-1 ${
                isMyMessage ? "text-blue-100" : "text-gray-400"
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
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">{topic}</h1>
            <div className="text-sm text-gray-500">Group Chat</div>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-sm text-gray-600">
              {isConnected ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-4xl mb-4">💬</div>
              <div className="text-lg font-medium text-gray-700 mb-2">Welcome to {topic}</div>
              <div className="text-sm text-gray-500">Start the conversation by sending a message</div>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {messages.map(renderMessage)}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <input
            className="flex-1 bg-gray-50 border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={!isConnected}
            maxLength={500}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || !isConnected}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3 rounded-full transition-colors duration-200 shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupRoom;