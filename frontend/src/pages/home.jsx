import { memo, useCallback, useState, useEffect } from 'react';
import { FiSun, FiMoon, FiMessageCircle, FiUsers, FiZap, FiShield, FiArrowRight, FiStar, FiTrendingUp } from 'react-icons/fi';


import useThemeStore from '../store/themeStore';
import { useNavigate } from 'react-router-dom';

const Home = memo(() => {
  const { darkMode, toggleDarkMode } = useThemeStore();
  const [isLoaded, setIsLoaded] = useState(true);
  const navigate = useNavigate();


  const handleLogin = useCallback(() => {
    navigate("/login");
  }, []);

  const handleSignup = useCallback(() => {
    navigate("/signup")
  }, []);

  const handleThemeToggle = useCallback(() => {
    toggleDarkMode();
  }, [toggleDarkMode]);

  const features = [
    {
      id: 'one-on-one',
      icon: FiMessageCircle,
      title: 'One-on-One Chat',
      description: 'Connect instantly with a random online user and have secure private conversations.',
      iconBg: 'bg-emerald-500',
      cardBg: 'bg-emerald-50 dark:bg-emerald-950/30',
      border: 'border-emerald-200/50 dark:border-emerald-800/50',
      titleColor: 'text-emerald-700 dark:text-emerald-300'
    },
    {
      id: 'group-discussions',
      icon: FiUsers,
      title: 'Group Discussions',
      description: 'Join interest-based chat groups and build your tribe. Tech, memes, projects — all welcome.',
      iconBg: 'bg-violet-500',
      cardBg: 'bg-violet-50 dark:bg-violet-950/30',
      border: 'border-violet-200/50 dark:border-violet-800/50',
      titleColor: 'text-violet-700 dark:text-violet-300'
    },
    {
      id: 'random-match',
      icon: FiZap,
      title: 'Random Match',
      description: 'Feeling lucky? Jump into a conversation with any available user online instantly.',
      iconBg: 'bg-amber-500',
      cardBg: 'bg-amber-50 dark:bg-amber-950/30',
      border: 'border-amber-200/50 dark:border-amber-800/50',
      titleColor: 'text-amber-700 dark:text-amber-300'
    },
    {
      id: 'secure-private',
      icon: FiShield,
      title: 'Secure & Private',
      description: 'Your conversations are protected with end-to-end encryption and privacy-first design.',
      iconBg: 'bg-rose-500',
      cardBg: 'bg-rose-50 dark:bg-rose-950/30',
      border: 'border-rose-200/50 dark:border-rose-800/50',
      titleColor: 'text-rose-700 dark:text-rose-300'
    }
  ];

  const stats = [
    { label: 'Active Users', value: '10K+', icon: FiUsers },
    { label: 'Messages Sent', value: '1M+', icon: FiMessageCircle },
    { label: 'Connections Made', value: '50K+', icon: FiZap }
  ];

 

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950' : 'bg-white'} overflow-hidden`}>
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Gradient Orbs */}
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 ${darkMode ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-gradient-to-br from-indigo-300 to-purple-400'} blur-3xl animate-pulse`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 ${darkMode ? 'bg-gradient-to-tr from-emerald-500 to-cyan-600' : 'bg-gradient-to-tr from-emerald-300 to-cyan-400'} blur-3xl animate-pulse`} style={{ animationDelay: '1s' }}></div>
        
        
        
      </div>

      {/* Header */}
      <header className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <FiMessageCircle className="text-white" size={20} />
              </div>
              <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                We<span className="text-indigo-600">&</span>I
              </span>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleThemeToggle}
                className={`
                  p-3 rounded-xl border transition-all duration-200 backdrop-blur-sm
                  ${darkMode 
                    ? 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:border-slate-600' 
                    : 'bg-white/70 border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300'
                  }
                  focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400
                `}
                aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
              >
                {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>
              
              <button
                onClick={handleLogin}
                className={`
                  px-6 py-3 rounded-xl font-medium transition-all duration-200 backdrop-blur-sm
                  ${darkMode
                    ? 'bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                    : 'bg-white/70 border border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300'
                  }
                  focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400
                `}
              >
                Login
              </button>
              
              <button
                onClick={handleSignup}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-lg shadow-indigo-500/25"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <section className="text-center py-20">
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8 backdrop-blur-sm transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${darkMode ? 'bg-slate-800/50 border-slate-700/50 text-slate-300' : 'bg-white/70 border-slate-200 text-slate-600'}`}>
              <div className="flex items-center gap-1">
                <FiStar className="text-yellow-500" size={14} />
                <span className="text-sm font-medium">Trusted by 10K+ users</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-400"></div>
              <div className="flex items-center gap-1">
                <FiTrendingUp className="text-green-500" size={14} />
                <span className="text-sm font-medium">Growing fast</span>
              </div>
            </div>

            <div className="mb-12">
              <h1 className={`text-8xl font-black tracking-tight mb-6 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                <span className="relative inline-block">
                  We<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">&</span>I
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 blur-lg -z-10 animate-pulse"></div>
                </span>
              </h1>
              <p className={`text-2xl leading-relaxed max-w-3xl mx-auto mb-6 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${darkMode ? 'text-slate-300' : 'text-slate-700'}`} style={{ transitionDelay: '200ms' }}>
                Where conversations come alive
              </p>
              <p className={`text-lg leading-relaxed max-w-2xl mx-auto transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${darkMode ? 'text-slate-400' : 'text-slate-600'}`} style={{ transitionDelay: '400ms' }}>
                A modern chat platform for instant conversations, built for curious minds and coder clans. Connect, share, and discover amazing people from around the world.
              </p>
            </div>

            {/* Stats */}
            <div className={`flex justify-center gap-8 mb-12 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '600ms' }}>
              {stats.map((stat, index) => (
                <div key={stat.label} className={`text-center px-6 py-4 rounded-2xl backdrop-blur-sm ${darkMode ? 'bg-slate-800/30' : 'bg-white/50'}`}>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <stat.icon className="text-indigo-500" size={18} />
                    <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {stat.value}
                    </span>
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
            
            <div className={`flex justify-center gap-6 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '800ms' }}>
              <button
                onClick={handleSignup}
                className="group px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105"
              >
                <span className="flex items-center gap-2">
                  Get Started Free
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </span>
              </button>
              <button
                onClick={handleSignup}
                className={`
                  px-10 py-5 font-semibold rounded-2xl border-2 transition-all duration-200 backdrop-blur-sm hover:scale-105
                  ${darkMode
                    ? 'border-slate-600 text-slate-300 hover:bg-slate-800/50 hover:border-slate-500'
                    : 'border-slate-300 text-slate-700 hover:bg-white/70 hover:border-slate-400'
                  }
                  focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400
                `}
              >
                Watch Demo
              </button>
            </div>

            {/* Visual Elements */}
            <div className="mt-20 relative">
              <div className={`mx-auto w-fit p-8 rounded-3xl backdrop-blur-sm transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${darkMode ? 'bg-slate-800/30' : 'bg-white/50'}`} style={{ transitionDelay: '1000ms' }}>
                <div className="flex items-center justify-center gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-3 animate-bounce" style={{ animationDelay: '0ms' }}>
                      <FiMessageCircle className="text-white" size={28} />
                    </div>
                    <div className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Instant Chat</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-3 animate-bounce" style={{ animationDelay: '500ms' }}>
                      <FiUsers className="text-white" size={28} />
                    </div>
                    <div className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Global Community</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse" style={{ animationDelay: '250ms' }}></div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-3 animate-bounce" style={{ animationDelay: '1000ms' }}>
                      <FiShield className="text-white" size={28} />
                    </div>
                    <div className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Secure & Private</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section className="py-20">
            <div className="text-center mb-16">
              <h2 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Why Choose We&I?
              </h2>
              <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Everything you need for seamless conversations
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature) => {
                const IconComponent = feature.icon;
                return (
                  <article
                    key={feature.id}
                    className={`
                      group p-8 rounded-2xl border ${feature.cardBg} ${feature.border}
                      hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20
                      transition-all duration-300 cursor-pointer
                      hover:-translate-y-1
                    `}
                  >
                    <div className="flex items-start gap-6">
                      <div className={`
                        flex-shrink-0 p-4 rounded-xl ${feature.iconBg} 
                        group-hover:scale-110 transition-transform duration-300
                      `}>
                        <IconComponent size={28} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-xl font-bold mb-3 ${feature.titleColor}`}>
                          {feature.title}
                        </h3>
                        <p className={`leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* CTA Section */}
          <section className={`text-center py-20 px-8 rounded-3xl ${darkMode ? 'bg-slate-900/50' : 'bg-slate-50'} mb-20`}>
            <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Ready to Start Chatting?
            </h2>
            <p className={`text-lg mb-8 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Join thousands of users already having amazing conversations
            </p>
            <button
              onClick={handleSignup}
              className="px-10 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-lg shadow-indigo-600/25"
            >
              Join We&I Today
            </button>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className={`py-12 border-t ${darkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50'} relative z-10`}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className={`${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>
            © 2024 We&I. Built for seamless conversations.
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
});

export default Home;