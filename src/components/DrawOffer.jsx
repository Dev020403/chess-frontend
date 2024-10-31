import React from "react";
import { Crown, Flag } from "lucide-react";

const DrawOffer = ({ onAccept, onDecline }) => (
  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 animate-fade-in">
    <h3 className="text-lg font-medium text-white mb-4">Draw Offer</h3>
    <div className="space-y-3">
      <button
        onClick={onAccept}
        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
      >
        <Crown className="w-5 h-5" />
        <span className="font-medium">Accept Draw</span>
      </button>
      <button
        onClick={onDecline}
        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
      >
        <Flag className="w-5 h-5" />
        <span className="font-medium">Decline Draw</span>
      </button>
    </div>
  </div>
);

export default DrawOffer;
