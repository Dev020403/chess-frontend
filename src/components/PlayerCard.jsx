import React, { memo } from "react";
import { Clock, User } from "lucide-react";

const PlayerCard = ({ player, color, isCurrentTurn, timeLeft }) => (
  <div
    className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 ${
      isCurrentTurn ? "ring-2 ring-blue-500 shadow-lg shadow-blue-500/20" : ""
    }`}
  >
    <div className="flex items-center space-x-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
          <User className="w-6 h-6 text-gray-400" />
        </div>
        <div
          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800 ${
            color === "white" ? "bg-white" : "bg-gray-900"
          }`}
        />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-medium text-white">
          {player?.username || "Waiting..."}
        </h3>
      </div>
    </div>
  </div>
);

export default memo(PlayerCard);
