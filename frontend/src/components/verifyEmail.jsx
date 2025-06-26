import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { sendEmailVerification } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useThemeStore from "../store/themeStore";

const VerifyEmail = () => {
  const { darkMode, toggleDarkMode } = useThemeStore();
  const [timer, setTimer] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const sec = (seconds % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  const handleResend = async () => {
    try {
      await sendEmailVerification(auth.currentUser);
      toast.success("Verification email resent successfully.");
      setCanResend(false);
      setTimer(300); 
    } catch (error) {
      toast.error("Failed to send email. Try again later.");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 transition-all duration-500 ${
        darkMode 
          ? "bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900" 
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      }`}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 animate-pulse ${
          darkMode ? "bg-purple-500" : "bg-blue-300"
        }`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 animate-pulse delay-1000 ${
          darkMode ? "bg-violet-500" : "bg-indigo-300"
        }`}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10 animate-spin ${
          darkMode ? "bg-gradient-to-r from-purple-400 to-violet-400" : "bg-gradient-to-r from-blue-400 to-indigo-400"
        }`} style={{ animationDuration: '20s' }}></div>
      </div>

      <ToastContainer 
        theme={darkMode ? "dark" : "light"} 
        position="top-right"
        toastClassName="backdrop-blur-sm"
      />
      
      <div className={`max-w-md w-full p-8 rounded-3xl shadow-2xl relative backdrop-blur-xl border transition-all duration-500 transform hover:scale-105 ${
        darkMode 
          ? "bg-gray-800/80 border-gray-700/50 shadow-purple-500/20" 
          : "bg-white/80 border-white/50 shadow-blue-500/20"
      }`}>
        {/* Decorative gradient border */}
        <div className={`absolute inset-0 rounded-3xl p-[2px] ${
          darkMode 
            ? "bg-gradient-to-r from-purple-500 via-violet-500 to-purple-500" 
            : "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
        }`}>
          <div className={`h-full w-full rounded-3xl ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Theme toggle */}
          <button
            onClick={toggleDarkMode}
            className={`absolute -top-2 -right-2 p-3 rounded-2xl transition-all duration-300 hover:scale-110 ${
              darkMode
                ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 shadow-yellow-400/25"
                : "bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-purple-600/25"
            } shadow-lg hover:shadow-xl`}
          >
            <span className="text-lg">{darkMode ? "☀️" : "🌙"}</span>
          </button>

          {/* Email icon with animation */}
          <div className="flex justify-center mb-6">
            <div className={`p-4 rounded-full ${
              darkMode 
                ? "bg-gradient-to-r from-purple-500 to-violet-500" 
                : "bg-gradient-to-r from-blue-500 to-indigo-500"
            } shadow-lg animate-bounce`}>
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
          </div>

          {/* Title with gradient text */}
          <h2 className={`text-3xl font-bold mb-2 text-center bg-gradient-to-r bg-clip-text text-transparent ${
            darkMode
              ? "from-purple-400 via-violet-400 to-purple-400"
              : "from-blue-600 via-indigo-600 to-purple-600"
          }`}>
            Verify Your Email
          </h2>

          {/* Subtitle */}
          <p className={`mb-8 text-center text-lg ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}>
            We've sent a verification link to your email. Please check your inbox or spam folder.
          </p>

          {/* Timer display */}
          {!canResend && (
            <div className="text-center mb-6">
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                darkMode 
                  ? "bg-gray-700/50 text-purple-300" 
                  : "bg-blue-50 text-blue-600"
              }`}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Resend available in {formatTime(timer)}
              </div>
            </div>
          )}

          {/* Resend button */}
          <div className="text-center">
            <button
              onClick={handleResend}
              disabled={!canResend}
              className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 transform ${
                canResend
                  ? `${
                      darkMode
                        ? "bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 shadow-purple-500/25"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/25"
                    } text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95`
                  : `${
                      darkMode
                        ? "bg-gray-700 text-gray-400"
                        : "bg-gray-200 text-gray-500"
                    } cursor-not-allowed opacity-60`
              }`}
            >
              {canResend ? (
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Resend Verification Email
                </span>
              ) : (
                `Resend available in ${formatTime(timer)}`
              )}
            </button>
          </div>

          {/* Additional info */}
          <div className="mt-6 text-center">
            <p className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}>
              Didn't receive the email? Check your spam folder or try again.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;