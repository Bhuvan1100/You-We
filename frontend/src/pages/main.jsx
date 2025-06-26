import React, { useEffect } from "react";
import useUserStore from "../store/userStore";
import { useNavigate } from "react-router-dom";

const Main = () => {
  const { user } = useUserStore();
  const navigate = useNavigate();

  const handleNavigation = (type) => {
    if (type === "one") navigate("/chat/one-to-one");
    else navigate("/chat/group");
  };
  console.log(user.name);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      {/* Header */}
      <div className="w-full max-w-3xl p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md mb-10 text-center">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Welcome, {user?.name || "User"}!</h1>
        <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">Email: {user?.email}</p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <button
          onClick={() => handleNavigation("one")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition duration-300"
        >
          Chat One-to-One
        </button>
        <button
          onClick={() => handleNavigation("group")}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition duration-300"
        >
          Group Chat
        </button>
      </div>
    </div>
  );
};

export default Main;
