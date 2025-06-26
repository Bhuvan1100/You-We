import { useNavigate } from 'react-router-dom';
import { memo, useCallback } from 'react';
import useThemeStore from '../store/themeStore';
import { FiSun, FiMoon, FiMessageCircle, FiUsers, FiZap, FiShield } from 'react-icons/fi';

const Home = memo(() => {
  const { darkMode, toggleDarkMode } = useThemeStore();
  const navigate = useNavigate();

  const handleLogin = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  const handleSignup = useCallback(() => {
    navigate('/signup');
  }, [navigate]);

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

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950' : 'bg-white'}`}>
      {/* Header */}
      <header className="relative">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex justify-end items-center gap-4">
            <button
              onClick={handleThemeToggle}
              className={`
                p-3 rounded-xl border transition-all duration-200
                ${darkMode 
                  ? 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:border-slate-600' 
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
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
                px-6 py-3 rounded-xl font-medium transition-all duration-200
                ${darkMode
                  ? 'bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                  : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 hover:border-slate-300'
                }
                focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400
              `}
            >
              Login
            </button>
            
            <button
              onClick={handleSignup}
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <section className="text-center py-20">
            <div className="mb-8">
              <h1 className={`text-7xl font-black tracking-tight mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                We<span className="text-indigo-600">&</span>I
              </h1>
              <p className={`text-xl leading-relaxed max-w-2xl mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                A modern chat platform for instant conversations, built for curious minds and coder clans.
              </p>
            </div>
            
            <div className="flex justify-center gap-6 mt-12">
              <button
                onClick={handleSignup}
                className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-lg shadow-indigo-600/25"
              >
                Get Started
              </button>
              <button
                onClick={handleSignup}
                className={`
                  px-8 py-4 font-semibold rounded-xl border-2 transition-all duration-200
                  ${darkMode
                    ? 'border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                    : 'border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400'
                  }
                  focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400
                `}
              >
                Learn More
              </button>
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
      <footer className={`py-12 border-t ${darkMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50'}`}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className={`${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>
            © 2024 We&I. Built for seamless conversations.
          </p>
        </div>
      </footer>
    </div>
  );
});

Home.displayName = 'Home';

export default Home;