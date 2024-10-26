import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false); // Add loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin
      ? "http://localhost:8080/api/auth/login"
      : "http://localhost:8080/api/auth/register";

    setLoading(true); // Set loading to true when the request starts

    try {
      const response = await axios.post(endpoint, formData);

      if (response.status === 200) {
        toast.success("Success! Welcome to the application.");
      }
      if (response.status === 201) {
        toast.success("Success! Account created successfully.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.error || "An error occurred");
    } finally {
      setLoading(false); // Reset loading state after request completion
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden p-8">
          {/* Toggle Buttons */}
          <div className="flex mb-8 bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                !isLogin
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              disabled={loading} // Disable button when loading
            >
              Sign Up
            </button>
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                isLogin
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              disabled={loading} // Disable button when loading
            >
              Login
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <input
                type="text"
                name="username"
                placeholder="Username"
                onChange={handleChange}
                className="w-full bg-gray-700 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="Email Id"
              onChange={handleChange}
              className="w-full bg-gray-700 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />

            <input
              type="password"
              name="password"
              placeholder={isLogin ? "Password" : "Create Password"}
              onChange={handleChange}
              className="w-full bg-gray-700 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />

            {!isLogin && (
              <div className="text-sm text-gray-400">
                By creating an account you agree to our{" "}
                <a href="/" className="text-purple-500 hover:text-purple-400">
                  Terms and Conditions
                </a>
              </div>
            )}

            <button
              type="submit"
              className={`w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg transition-colors duration-300 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={loading} // Disable button while loading
            >
              {loading ? "Loading..." : isLogin ? "Login" : "Create Account"}
            </button>

            <div className="text-center text-sm">
              <a href="/" className="text-purple-500 hover:text-purple-400">
                Need Help? Contact Us
              </a>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AuthForm;
