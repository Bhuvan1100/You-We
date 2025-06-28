import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import useUserStore from "../store/userStore";

export default function OneToOneChat() {
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const [roomId, setRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [partnerInfo, setPartnerInfo] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);

  const { user, backendData } = useUserStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    socketRef.current = io("http://localhost:5000");
    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
      setIsConnected(true);
      
      socket.emit("ready-for-chat", {
        user: {
          name: user?.name || "Anonymous",
          email: user?.email || "unknown@example.com",
        },
      });
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("match-found", ({ roomId, partner }) => {
      console.log("Matched in:", roomId, "with:", partner);
      setRoomId(roomId);
      setPartnerInfo(partner);
      setMessages([{ text: "Connected with a partner!", sender: "system" }]);
    });

    socket.on("message", ({ sender, text }) => {
      setMessages((prev) => [...prev, { sender, text }]);
    });

    socket.on("partner-left", () => {
      setMessages((prev) => [
        ...prev,
        { text: "Partner disconnected", sender: "system" },
      ]);
      setPartnerInfo(null);
    });

    return () => {
      socket.disconnect();
    };
  }, [user, backendData]);

  const sendMessage = () => {
    const socket = socketRef.current;
    if (!roomId || !input.trim()) return;

    socket.emit("message", { roomId, text: input });
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleReturn = () => {
    navigate("/main");
  };

  const handleLeaveChat = () => {
    const socket = socketRef.current;
    if (roomId && socket && partnerInfo) {
      
      socket.emit("message", { 
        roomId, 
        text: `${user?.name || "Anonymous"} has left the chat`,
        sender: "system"
      });

      setMessages((prev)=>{
      [...prev, {text: "you disconnected", sender: "system"}]
      })

      
      // Leave the room
      socket.emit("leave-room", { roomId });
    }
    
    // Clear local state
    setRoomId(null);
    setPartnerInfo(null);
    setMessages([]);
    
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>

      {/* Chat Section - Left Side */}
      <div className="flex-1 flex flex-col bg-white shadow-lg h-screen">
        {/* Chat Header - Fixed */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white p-4 shadow-lg flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="text-xl">💬</span>
            </div>
            <div className="flex-1">
              <h1 className="text-lg font-semibold">One-to-One Chat</h1>
              <div className="flex items-center text-sm opacity-90 mt-1">
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  isConnected ? 'bg-green-400' : 'bg-red-400'
                } animate-pulse`}></div>
                {partnerInfo ? (
                  <span>Connected with {partnerInfo.name}</span>
                ) : roomId ? (
                  <span className="text-yellow-200">Partner disconnected</span>
                ) : (
                  <span className="text-yellow-200">Finding a partner...</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area - Scrollable */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
          <div className="space-y-3 min-h-full">
            {messages.length === 0 && !roomId && (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4 shadow-md">
                  <span className="text-2xl">⏳</span>
                </div>
                <p className="text-lg font-medium text-gray-700 mb-2">Looking for someone to chat with...</p>
                <p className="text-sm text-gray-500 mb-4">You'll be connected shortly</p>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <div key={idx} className="flex animate-fadeIn">
                {msg.sender === "system" ? (
                  <div className="w-full flex justify-center">
                    <div className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm border border-blue-200">
                      {msg.text}
                    </div>
                  </div>
                ) : (
                  <div className={`flex w-full ${
                    msg.sender === socketRef.current?.id ? 'justify-end' : 'justify-start'
                  }`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm ${
                      msg.sender === socketRef.current?.id
                        ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-sm'
                        : 'bg-white text-gray-800 rounded-bl-sm border border-gray-200'
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area - Fixed */}
        <div className="border-t bg-white p-4 flex-shrink-0">
          {roomId && partnerInfo ? (
            <div className="flex items-end space-x-3">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message... (Press Enter to send)"
                  className="w-full resize-none border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  rows="1"
                  style={{
                    minHeight: '44px',
                    maxHeight: '100px',
                    overflow: 'hidden'
                  }}
                  onInput={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
                  }}
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 ${
                  input.trim()
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <svg className="w-4 h-4 transform rotate-45" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="inline-flex items-center space-x-2 text-gray-500">
                <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                <span className="ml-2 text-sm font-medium">
                  {roomId ? "Sorry your Partner left...." : "Connecting you with someone..."}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Control Panel - Right Side */}
      <div className="w-80 bg-white border-l border-gray-200 shadow-lg h-screen overflow-y-auto">
        <div className="p-6">
          {/* User Info Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Chat Controls</h2>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || "A"}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">{user?.name || "Anonymous"}</p>
                  <p className="text-sm text-gray-500">You</p>
                </div>
              </div>
              
              {partnerInfo && (
                <div className="flex items-center space-x-3 pt-3 border-t border-gray-200">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold text-sm">
                      {partnerInfo.name?.charAt(0)?.toUpperCase() || "P"}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{partnerInfo.name}</p>
                    <p className="text-sm text-gray-500">Partner</p>
                  </div>
                </div>
              )}
            </div>

            {/* Connection Status */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-gray-800 mb-3">Connection Status</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Server</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm font-medium">{isConnected ? 'Connected' : 'Disconnected'}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Partner</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${partnerInfo ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <span className="text-sm font-medium">{partnerInfo ? 'Connected' : 'Not connected'}</span>
                  </div>
                </div>
                {roomId && (
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Room ID</span>
                    <span className="text-sm font-mono font-medium text-gray-800">{roomId.slice(-6)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 mb-6">
            <button
              onClick={handleReturn}
              className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Return to Main</span>
            </button>

            <button
              onClick={handleLeaveChat}
              disabled={!roomId || !partnerInfo}
              className={`w-full font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-md flex items-center justify-center space-x-2 ${
                roomId && partnerInfo
                  ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Leave Chat</span>
            </button>
          </div>

          {/* Help Text */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2">Quick Tips</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Press Enter to send messages</li>
              <li>• Use "Leave Chat" to disconnect from partner</li>
              <li>• "Return to Main" goes back to main page</li>
              <li>• Messages are not saved after leaving</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}