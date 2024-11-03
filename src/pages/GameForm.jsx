import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const GameForm = () => {
  const [gameId, setGameId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const baseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";
  const handleCreateGame = async () => {
    setLoading(true);
    try {
      const playerId = JSON.parse(localStorage.getItem("user"))._id;
      const response = await axios.post(`${baseUrl}/api/game/create`, {
        playerId,
      });
      if (response.status === 201) {
        toast.success("Game created successfully!", {
          autoClose: 1000,
          onClose: () => {
            navigate(`/game/room/${response.data.game.gameId}`);
          },
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGame = async () => {
    if (!gameId.trim()) {
      toast.error("Please enter a game ID");
      return;
    }
    setLoading(true);
    try {
      const playerId = JSON.parse(localStorage.getItem("user"))._id;
      const response = await axios.post(`${baseUrl}/api/game/join/${gameId}`, {
        playerId,
      });
      if (response.status === 200) {
        toast.success("Game joined successfully!", {
          autoClose: 1000,
          onClose: () => {
            navigate(`/game/room/${gameId}`);
          },
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
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
                (Math.floor(i / 8) + (i % 8)) % 2 === 0
                  ? "bg-white"
                  : "bg-black"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-gray-900 rounded-2xl shadow-2xl border border-purple-500/20 overflow-hidden">
          {/* Chess piece decorative header */}
          <div className="h-16 bg-gradient-to-r from-purple-900/50 to-gray-900 flex items-center justify-around px-4 border-b border-purple-500/20">
            {["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"].map((piece, i) => (
              <span
                key={i}
                className="text-purple-400 text-2xl transform hover:scale-110 transition-transform cursor-default"
              >
                {piece}
              </span>
            ))}
          </div>

          <div className="p-8">
            <h2 className="text-3xl font-extrabold text-white mb-8 text-center flex items-center justify-center gap-3">
              <span className="text-purple-400">♕</span>
              Chess Arena
              <span className="text-purple-400">♔</span>
            </h2>

            <div className="space-y-6">
              <button
                onClick={handleCreateGame}
                className={`w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 
                  text-white font-medium py-4 rounded-lg transition-all duration-300 relative group ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                disabled={loading}
              >
                <span className="absolute left-4 bottom-3 text-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                  ♔
                </span>
                <span className="relative inline-flex items-center justify-center">
                  {loading ? (
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  ) : null}
                  {loading ? "Creating Game..." : "Create New Game"}
                </span>
              </button>

              <div className="relative group">
                <span className="absolute left-4 top-3 text-purple-400 text-lg group-hover:text-purple-300">
                  ♟
                </span>
                <input
                  type="text"
                  placeholder="Enter Game ID to Join"
                  value={gameId}
                  onChange={(e) => setGameId(e.target.value)}
                  className="w-full bg-gray-800 text-white placeholder-gray-400 px-12 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border border-purple-500/20 hover:border-purple-500/40 transition-all"
                />
              </div>

              <button
                onClick={handleJoinGame}
                className={`w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 
                  text-white font-medium py-4 rounded-lg transition-all duration-300 relative group ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                disabled={loading}
              >
                <span className="absolute left-4 bottom-3 text-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                  ♕
                </span>
                <span className="relative inline-flex items-center justify-center">
                  {loading ? (
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  ) : null}
                  {loading ? "Joining Game..." : "Join Game"}
                </span>
              </button>
            </div>
          </div>

          {/* Chess piece decorative footer */}
          <div className="h-16 bg-gradient-to-r from-gray-900 to-purple-900/50 flex items-center justify-around px-4 border-t border-purple-500/20">
            {["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"].map((piece, i) => (
              <span
                key={i}
                className="text-purple-400 text-2xl transform hover:scale-110 transition-transform cursor-default"
              >
                {piece}
              </span>
            ))}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default GameForm;
