import { useNavigate } from 'react-router-dom';
import useThemeStore from '../store/themeStore';
import { FiSun, FiMoon } from 'react-icons/fi';

const Home = () => {
  const { darkMode, toggleDarkMode } = useThemeStore();
  const navigate = useNavigate();

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} min-h-screen flex flex-col items-center justify-center transition-colors duration-300 px-4`}>
      {/* Dark Mode Toggle */}
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
        >
          {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button>
      </div>

      {/* Title & Description */}
      <h1 className="text-5xl font-extrabold mb-4 tracking-tight">We&amp;I</h1>
      <p className="text-lg text-center max-w-xl mb-8">
        A modern chat platform to connect tech enthusiasts — one-on-one or in interest-based groups.
      </p>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Login
        </button>
        <button
          onClick={() => navigate('/signup')}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Home;
