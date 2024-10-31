import React from "react";
import { Flag, Handshake } from "lucide-react";

const GameControls = ({ onResign, onOfferDraw, canOfferDraw }) => (
  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4">
    <h3 className="text-lg font-medium text-white mb-4">Game Controls</h3>
    <div className="space-y-3">
      <button
        onClick={onOfferDraw}
        disabled={!canOfferDraw}
        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
      >
        <Handshake className="w-5 h-5" />
        <span className="font-medium">Offer Draw</span>
      </button>
      <button
        onClick={onResign}
        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
      >
        <Flag className="w-5 h-5" />
        <span className="font-medium">Resign</span>
      </button>
    </div>
  </div>
);
export default GameControls;
