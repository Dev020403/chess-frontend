import React from "react";
import { CopyIcon, Share2 } from "lucide-react";

const GameHeader = ({ onCopyGameLink, copied }) => {
  return (
    <div className="flex justify-between items-center px-4">
      <h1 className="text-3xl font-bold text-white flex items-center gap-3">
        <span className="text-purple-400">♕</span>
        Chess Match
        <span className="text-purple-400">♔</span>
      </h1>
      <button
        onClick={onCopyGameLink}
        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 rounded-lg text-white transition-all duration-300"
      >
        {copied ? (
          <CopyIcon className="w-4 h-4 text-green-500" />
        ) : (
          <Share2 className="w-4 h-4" />
        )}
        <span>{copied ? "Copied!" : "Share Code"}</span>
      </button>
    </div>
  );
};

export default GameHeader;
