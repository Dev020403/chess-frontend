import React, { useState } from "react";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin
      ? "http://localhost:8080/api/auth/login"
      : "http://localhost:8080/api/auth/register";

    setLoading(true);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        window.location.href = "/game/create";
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Chess pattern background */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-8 h-full">
          {Array.from({ length: 64 }).map((_, i) => (
            <div
              key={i}
              className={`aspect-square ${
                (Math.floor(i / 8) + i % 8) % 2 === 0 ? 'bg-white' : 'bg-black'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main container */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-gray-900 rounded-2xl shadow-2xl border border-purple-500/20 overflow-hidden">
          {/* Chess piece decorative header */}
          <div className="h-16 bg-gradient-to-r from-purple-900/50 to-gray-900 flex items-center justify-around px-4 border-b border-purple-500/20">
            {['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'].map((piece, i) => (
              <span key={i} className="text-purple-400 text-2xl transform hover:scale-110 transition-transform cursor-default">
                {piece}
              </span>
            ))}
          </div>

          <div className="p-8">
            {/* Auth type toggle */}
            <div className="flex mb-8 bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  !isLogin ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
                disabled={loading}
              >
                Sign Up
              </button>
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isLogin ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
                disabled={loading}
              >
                Login
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="relative group">
                  <span className="absolute left-4 top-3 text-purple-400 text-lg group-hover:text-purple-300">♟</span>
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    onChange={handleChange}
                    className="w-full bg-gray-800 text-white placeholder-gray-400 px-12 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border border-purple-500/20 hover:border-purple-500/40 transition-all"
                  />
                </div>
              )}

              <div className="relative group">
                <span className="absolute left-4 top-3 text-purple-400 text-lg group-hover:text-purple-300">♝</span>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  onChange={handleChange}
                  className="w-full bg-gray-800 text-white placeholder-gray-400 px-12 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border border-purple-500/20 hover:border-purple-500/40 transition-all"
                />
              </div>

              <div className="relative group">
                <span className="absolute left-4 top-3 text-purple-400 text-lg group-hover:text-purple-300">♜</span>
                <input
                  type="password"
                  name="password"
                  placeholder={isLogin ? "Password" : "Create Password"}
                  onChange={handleChange}
                  className="w-full bg-gray-800 text-white placeholder-gray-400 px-12 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border border-purple-500/20 hover:border-purple-500/40 transition-all"
                />
              </div>

              {!isLogin && (
                <div className="text-sm text-gray-400">
                  By creating an account you agree to our{" "}
                  <a href="/" className="text-purple-400 hover:text-purple-300 transition-colors">
                    Terms and Conditions
                  </a>
                </div>
              )}

              <button
                type="submit"
                className={`w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-300 relative group ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={loading}
              >
                <span className="absolute left-4 opacity-0 group-hover:opacity-100 transition-opacity text-lg">♔</span>
                <span className="relative inline-flex items-center justify-center">
                  {loading ? (
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    isLogin ? "Login to Play" : "Join the Game"
                  )}
                </span>
              </button>

              <div className="text-center text-sm">
                <a href="/" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Need Help? Contact Support ♕
                </a>
              </div>
            </form>
          </div>

          {/* Chess piece decorative footer */}
          <div className="h-16 bg-gradient-to-r from-gray-900 to-purple-900/50 flex items-center justify-around px-4 border-t border-purple-500/20">
            {['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'].map((piece, i) => (
              <span key={i} className="text-purple-400 text-2xl transform hover:scale-110 transition-transform cursor-default">
                {piece}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;