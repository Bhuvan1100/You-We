import { useState } from "react";
import { Users, MessageCircle, Heart, Sparkles, Code, Music, Plane, Camera, Book, Coffee, Gamepad2, Palette, Star, Trophy, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
const GroupTopic = () => {
  const [selectedTopic, setSelectedTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  
 

  // Predefined safe topics with icons and descriptions
  const topics = [
    { id: "coding", name: "Coding & Tech", icon: Code, color: "bg-blue-500", description: "Share knowledge, debug together" },
    { id: "music", name: "Music Lovers", icon: Music, color: "bg-purple-500", description: "Discover new sounds, share favorites" },
    { id: "travel", name: "Travel Stories", icon: Plane, color: "bg-green-500", description: "Adventures, tips, dream destinations" },
    { id: "photography", name: "Photography", icon: Camera, color: "bg-pink-500", description: "Capture moments, share techniques" },
    { id: "books", name: "Book Club", icon: Book, color: "bg-amber-500", description: "Discuss stories, recommend reads" },
    { id: "coffee", name: "Coffee Chat", icon: Coffee, color: "bg-orange-500", description: "Casual conversations over coffee" },
    { id: "gaming", name: "Gaming Zone", icon: Gamepad2, color: "bg-indigo-500", description: "Games, strategies, fun times" },
    { id: "art", name: "Creative Arts", icon: Palette, color: "bg-rose-500", description: "Express creativity, share artwork" },
    { id: "movies", name: "Movie Buffs", icon: Star, color: "bg-yellow-500", description: "Reviews, recommendations, discussions" },
    { id: "sports", name: "Sports Talk", icon: Trophy, color: "bg-red-500", description: "Games, teams, friendly competition" },
    { id: "culture", name: "Cultural Exchange", icon: Globe, color: "bg-teal-500", description: "Share traditions, learn together" },
    { id: "general", name: "General Chat", icon: MessageCircle, color: "bg-gray-500", description: "Random conversations, make friends" }
  ];

  
  const harmfulWords = [
    'hate', 'racist', 'violence', 'abuse', 'harassment', 'discrimination',
    'suicide', 'self-harm', 'drug', 'illegal', 'scam', 'fraud'
  ];

  const containsHarmfulContent = (text) => {
    const lowerText = text.toLowerCase();
    return harmfulWords.some(word => lowerText.includes(word));
  };

  const handleTopicSelect = (topicId) => {
    setSelectedTopic(topicId);
    setShowCustomInput(false);
    setCustomTopic("");
  };

  const handleCustomTopicSubmit = () => {
    const topic = customTopic.trim();
    if (topic && !containsHarmfulContent(topic)) {
      setSelectedTopic(topic.toLowerCase().replace(/\s+/g, '-'));
      setShowCustomInput(false);
    }
  };
  const navigate = useNavigate();

  
  const navigateToChat = (topic) => {
  navigate(`/chat/group-room/${topic.trim().toLowerCase()}`);
  }  ;

  const handleJoin = async () => {
    const finalTopic = selectedTopic || customTopic.trim().toLowerCase().replace(/\s+/g, '-');
    
    if (!finalTopic) return;
    
    if (containsHarmfulContent(finalTopic)) {
      alert("Please choose a positive and friendly topic for everyone to enjoy! 😊");
      return;
    }

    setIsJoining(true);
    
    // Simulate loading for better UX
    setTimeout(() => {
      navigateToChat(finalTopic);
      setIsJoining(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex flex-col items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-white/5 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-40 right-1/3 w-8 h-8 bg-white/5 rounded-full animate-bounce delay-500"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Connect & Chat
            </h1>
            <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
          </div>
          <p className="text-xl text-white/90 mb-2">
            Now chat with your peers and make new friends! 🎉
          </p>
          <div className="flex items-center justify-center gap-2 text-white/80">
            <Users className="w-5 h-5" />
            <span>Join thousands of friendly conversations</span>
            <Heart className="w-5 h-5 text-red-300 animate-pulse" />
          </div>
        </div>

        {/* Topic Selection */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Choose Your Chat Topic
          </h2>
          
          {/* Predefined Topics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {topics.map((topic) => {
              const IconComponent = topic.icon;
              return (
                <button
                  key={topic.id}
                  onClick={() => handleTopicSelect(topic.id)}
                  className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                    selectedTopic === topic.id
                      ? `${topic.color} border-white text-white shadow-lg scale-105`
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <IconComponent 
                      className={`w-8 h-8 mb-2 transition-colors ${
                        selectedTopic === topic.id ? 'text-white' : 'text-gray-600 group-hover:text-gray-800'
                      }`} 
                    />
                    <h3 className="font-semibold text-sm mb-1">{topic.name}</h3>
                    <p className={`text-xs ${
                      selectedTopic === topic.id ? 'text-white/90' : 'text-gray-500'
                    }`}>
                      {topic.description}
                    </p>
                  </div>
                  {selectedTopic === topic.id && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-xs">✓</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Custom Topic Option */}
          <div className="border-t pt-6">
            {!showCustomInput ? (
              <button
                onClick={() => setShowCustomInput(true)}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors"
              >
                <MessageCircle className="w-6 h-6 mx-auto mb-2" />
                <span className="font-medium">Create Custom Topic</span>
                <p className="text-sm text-gray-500 mt-1">Start your own unique conversation</p>
              </button>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder="Enter your topic (e.g., cooking recipes, fitness tips)"
                    className="w-full p-4 border-2 border-gray-300 rounded-2xl focus:border-purple-500 focus:outline-none"
                    maxLength={50}
                  />
                  <span className="absolute bottom-2 right-4 text-xs text-gray-400">
                    {customTopic.length}/50
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCustomTopicSubmit}
                    disabled={!customTopic.trim() || containsHarmfulContent(customTopic)}
                    className="flex-1 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white py-3 rounded-xl font-medium transition-colors"
                  >
                    Use This Topic
                  </button>
                  <button
                    onClick={() => {
                      setShowCustomInput(false);
                      setCustomTopic("");
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
                {customTopic && containsHarmfulContent(customTopic) && (
                  <p className="text-sm text-red-500 text-center">
                    Please choose a positive and friendly topic! 😊
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Join Button */}
        <div className="text-center">
          <button
            onClick={handleJoin}
            disabled={!selectedTopic || isJoining}
            className={`px-12 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform ${
              selectedTopic && !isJoining
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isJoining ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Joining Chat...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <MessageCircle className="w-6 h-6" />
                Join Chat Room
              </div>
            )}
          </button>
          
          {selectedTopic && !isJoining && (
            <p className="mt-4 text-white/90 text-sm">
              Ready to join? Click above to start chatting! 🚀
            </p>
          )}
        </div>

        {/* Community Guidelines */}
        <div className="mt-8 text-center">
          <p className="text-white/80 text-sm">
            💝 Be kind, respectful, and have fun chatting with amazing people!
          </p>
        </div>
      </div>
    </div>
  );
};

export default GroupTopic;