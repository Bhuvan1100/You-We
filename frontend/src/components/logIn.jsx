// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useThemeStore from "../store/themeStore";
import { Moon, Sun } from "lucide-react";
import { getTokenAndSave } from "./jwtservice";

import useUserStore from "../store/userStore";

const Login = () => {
  const { darkMode, toggleDarkMode } = useThemeStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };





  const handleLogin = async (e) => {
  e.preventDefault();
  const { email, password } = formData;

  if (!email || !password) {
    toast.error("Please fill all fields");
    return;
  }

  try {
    setLoading(true);
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    toast.success("Login successful");

    // Hit your backend to get user info
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Backend login failed");
      return;
    }

    
    useUserStore.getState().setUser({
      name: data.name,
      email: data.email,
    });

    await getTokenAndSave(data.email)

    setTimeout(() => navigate("/main"), 1500);
  } catch (err) {
    toast.error(err.message || "Firebase login failed");
  } finally {
    setLoading(false);
  }
};




const handleGoogleLogin = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    toast.success("Google login successful");

    // Call backend to fetch existing user info
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: user.email }),
    });

    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Backend login failed");
      return;
    }

    useUserStore.getState().setUser({
      name: data.name,
      email: data.email,
    });
     await getTokenAndSave(data.email)

    setTimeout(() => navigate("/main"), 1000);
  } catch (err) {
    toast.error("Google sign-in failed");
  }
};




  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <ToastContainer />
      <div className="absolute top-4 right-4">
        <button onClick={toggleDarkMode} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">Welcome Back</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded-md border dark:border-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-white"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded-md border dark:border-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-white"
            value={formData.password}
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center my-4 text-gray-500 dark:text-gray-400">OR</div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 border dark:border-gray-600 py-2 rounded-md hover:shadow-md dark:bg-gray-700"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          <span className="dark:text-white">Login with Google</span>
        </button>
      </div>
    </div>
  );
};

export default Login;
