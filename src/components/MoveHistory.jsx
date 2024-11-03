import React from 'react';

const MovesHistory = ({ moves = [] }) => {
  const renderMoveNumber = (index) => {
    return Math.floor(index / 2) + 1;
  };

  return (
    <div className="bg-gray-900/95 rounded-lg border border-purple-500/20 overflow-hidden flex flex-col h-[640px]">
      <div className="p-4 border-b border-purple-500/20 bg-gray-800/50">
        <h2 className="text-xl font-bold text-white">Moves History</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-[4rem_1fr_1fr] gap-2">
          {moves.map((move, index) => {
            const isEvenMove = index % 2 === 0;
            if (isEvenMove) {
              return (
                <React.Fragment key={index}>
                  <div className="text-gray-500 font-mono">
                    {renderMoveNumber(index)}.
                  </div>
                  <div className="text-white font-medium hover:bg-gray-800 px-2 py-1 rounded cursor-pointer">
                    {move}
                  </div>
                  {moves[index + 1] && (
                    <div className="text-white font-medium hover:bg-gray-800 px-2 py-1 rounded cursor-pointer">
                      {moves[index + 1]}
                    </div>
                  )}
                </React.Fragment>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

export default MovesHistory;