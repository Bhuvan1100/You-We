import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { sendEmailVerification } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useThemeStore from "../store/themeStore";
import { useNavigate } from "react-router-dom";
import useUserStore from "../store/userStore";
import { getTokenAndSave } from "./jwtservice";



const VerifyEmail = () => {
  const { darkMode, toggleDarkMode } = useThemeStore();
  const [timer, setTimer] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();

  
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

  
 useEffect(() => {
  const interval = setInterval(async () => {
    await auth.currentUser?.reload();

    if (auth.currentUser?.emailVerified) {
      toast.success("Email verified successfully!");

      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/sign-up`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: auth.currentUser.displayName || "We&I User",
            email: auth.currentUser.email,
            loginMethod: "email",
          }),
        });

        if (!res.ok) throw new Error("Failed to save user in backend");
        const data = await res.json();

        
        useUserStore.getState().setUser({
          name: data.name,
          email: data.email,

        });
        await getTokenAndSave(data.email)

        // Optional: if your backend returns more user data (like _id, bio, etc.)
        useUserStore.getState().setBackendData(data);

        navigate("/main");
      } catch (err) {
        toast.error("Backend error while saving user!");
      }

      clearInterval(interval);
    }
  }, 5000); 

  return () => clearInterval(interval);
}, []);


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
      className={`min-h-screen flex items-center justify-center px-4 transition-all duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <ToastContainer theme={darkMode ? "dark" : "light"} />
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl relative">
        <button
          onClick={toggleDarkMode}
          className="absolute top-4 right-4 text-sm px-3 py-1 rounded-lg border dark:border-gray-600 border-gray-300"
        >
          {darkMode ? "🌞 Light" : "🌙 Dark"}
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600 dark:text-blue-400">
          Verify Your Email
        </h2>

        <p className="mb-6 text-sm text-center text-gray-600 dark:text-gray-300">
          We've sent a verification link to your email. Please check your inbox
          or spam folder.
        </p>

        <div className="text-center">
          <button
            onClick={handleResend}
            disabled={!canResend}
            className={`w-full py-2 rounded-lg font-semibold transition-colors ${
              canResend
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-300 cursor-not-allowed"
            }`}
          >
            {canResend
              ? "Resend Verification Email"
              : `Resend available in ${formatTime(timer)}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
