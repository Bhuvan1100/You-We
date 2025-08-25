import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, sendEmailVerification, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useUserStore from "../store/userStore";
import useThemeStore from "../store/themeStore";
import { updateProfile } from "firebase/auth";
import { FiSun, FiMoon } from "react-icons/fi";
import { getTokenAndSave } from "./jwtservice";

const Signup = () => {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useThemeStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill out all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCred.user);
      toast.success("Verification email sent");
      await updateProfile(auth.currentUser, {
        displayName: formData.name, 
      });
      setTimeout(() => navigate("/verify"), 2000);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/sign-up`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          loginMethod: "google",
        }),
      });

      if (!response.ok) throw new Error("Backend failed to create user");

      const data = await response.json();

      useUserStore.getState().setUser({
        name: data.name,
        email: data.email,
      });
       await getTokenAndSave(data.email)


      navigate("/main");
    } catch (err) {
      toast.error("Google sign-in failed");
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-8 ${darkMode 
      ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800' 
      : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'
    }`}>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
      />

      {/* Theme Toggle Button - Top Right */}
      <button
        onClick={toggleDarkMode}
        className={`
          fixed top-6 right-6 z-10 p-3 rounded-xl border transition-all duration-200
          ${darkMode 
            ? 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:border-slate-600' 
            : 'bg-white/80 border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300'
          }
          focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 backdrop-blur-sm
        `}
        aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
      >
        {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
      </button>
      
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-black mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Join We<span className="text-indigo-600">&</span>I
          </h1>
          <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Create your account and start connecting
          </p>
        </div>

        {/* Main Form Card */}
        <div className={`p-8 rounded-3xl shadow-2xl border backdrop-blur-lg ${
          darkMode 
            ? 'bg-slate-900/80 border-slate-800/50' 
            : 'bg-white/80 border-white/20'
        }`}>
          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Name Input */}
            <div className="space-y-2">
              <label htmlFor="name" className={`block text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all duration-200 ${
                  darkMode
                    ? 'border-slate-700 bg-slate-800 text-white placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                    : 'border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                }`}
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className={`block text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all duration-200 ${
                  darkMode
                    ? 'border-slate-700 bg-slate-800 text-white placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                    : 'border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                }`}
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className={`block text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Create a secure password"
                className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all duration-200 ${
                  darkMode
                    ? 'border-slate-700 bg-slate-800 text-white placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                    : 'border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                }`}
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className={`block text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all duration-200 ${
                  darkMode
                    ? 'border-slate-700 bg-slate-800 text-white placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                    : 'border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                }`}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3 px-4 rounded-xl font-semibold text-lg shadow-lg shadow-indigo-600/25 hover:shadow-xl hover:shadow-indigo-600/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-4 font-medium ${
                darkMode 
                  ? 'bg-slate-900 text-slate-400' 
                  : 'bg-white text-slate-500'
              }`}>
                OR
              </span>
            </div>
          </div>

          {/* Google Sign Up Button */}
          <button
            onClick={handleGoogleSignup}
            className={`w-full border-2 py-3 px-4 rounded-xl flex items-center justify-center gap-3 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200 ${
              darkMode
                ? 'bg-slate-800 border-slate-700 hover:border-slate-600 hover:bg-slate-750'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google" 
              className="w-6 h-6" 
            />
            <span className={`font-semibold text-lg ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
              Continue with Google
            </span>
          </button>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className={`font-semibold hover:underline focus:outline-none focus:underline transition-colors duration-200 ${
                  darkMode 
                    ? 'text-indigo-400 hover:text-indigo-300' 
                    : 'text-indigo-600 hover:text-indigo-700'
                }`}
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;