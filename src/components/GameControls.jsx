// GameControls.jsx
import React from 'react';
import { Flag, Handshake } from 'lucide-react';

const GameControls = ({ onResign, onOfferDraw, canOfferDraw }) => {
  return (
    <div className="bg-gray-900/95 rounded-lg border border-purple-500/20 p-4 space-y-4">      
      <div className="flex flex-col space-y-3">
        <button
          onClick={onOfferDraw}
          disabled={!canOfferDraw}
          className="flex items-center justify-center p-3 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-600 disabled:hover:bg-gray-600 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
        >
          <div className="flex items-center space-x-3">
            <Handshake className="w-5 h-5" />
            <span className="font-medium">Offer Draw</span>
          </div>
        </button>

        <button
          onClick={onResign}
          className="flex items-center justify-center p-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Flag className="w-5 h-5" />
            <span className="font-medium">Resign Game</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default GameControls;