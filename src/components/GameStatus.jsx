import React from "react";

const GameStatus = ({ game }) => {
  if (game.status !== "completed") return null;

  return (
    <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6 rounded-lg text-center shadow-lg border border-purple-500/20">
      <h2 className="text-xl font-bold flex items-center justify-center gap-3">
        <span className="text-2xl">♔</span>
        Game Over -{" "}
        {game.result === "draw"
          ? "Draw!"
          : `${game.result === "white" ? "White" : "Black"} wins!`}
        <span className="text-2xl">♕</span>
      </h2>
    </div>
  );
};

export default GameStatus;
