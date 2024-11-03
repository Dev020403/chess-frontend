import React, { useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

const GameBoard = ({ game, userColor, onDrop, isGameActive }) => {
  const [promotionModalOpen, setPromotionModalOpen] = useState(false);
  const [promotionMove, setPromotionMove] = useState(null);

  // Create a chess instance to check for promotion
  const chess = new Chess(game.fen);

  const handlePieceDrop = (sourceSquare, targetSquare) => {
    // Get the piece that's moving
    const piece = chess.get(sourceSquare);

    // Check if this is a pawn promotion move
    const isPromotion =
      piece?.type === "p" &&
      ((piece.color === "w" && targetSquare[1] === "8") ||
        (piece.color === "b" && targetSquare[1] === "1"));

    if (isPromotion) {
      setPromotionMove({ from: sourceSquare, to: targetSquare });
      setPromotionModalOpen(true);
      return false; // Prevent the move until promotion piece is selected
    }

    // If not a promotion, handle normal move
    return onDrop(sourceSquare, targetSquare);
  };

  const handlePromotion = (promotionPiece) => {
    setPromotionModalOpen(false);
    onDrop(promotionMove.from, promotionMove.to, promotionPiece);
    setPromotionMove(null);
  };

  // Map of piece types to their unicode symbols
  const pieceSymbols = {
    q: userColor === "white" ? "♕" : "♛",
    r: userColor === "white" ? "♖" : "♜",
    b: userColor === "white" ? "♗" : "♝",
    n: userColor === "white" ? "♘" : "♞",
  };

  return (
    <div className="lg:col-span-2 bg-gray-900 p-6 rounded-lg border border-purple-500/20">
      <div className="relative aspect-square">
        <Chessboard
          arePiecesDraggable={isGameActive}
          position={game.fen}
          onPieceDrop={isGameActive ? handlePieceDrop : null}
          boardOrientation={userColor}
          customBoardStyle={{
            borderRadius: "0.5rem",
            boxShadow: "0 0 20px rgba(147, 51, 234, 0.1)",
            border: "1px solid rgba(147, 51, 234, 0.2)",
          }}
          arePremovesAllowed={false}
        />

        {/* Custom Promotion Modal */}
        {promotionModalOpen && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-purple-500/20">
              <h3 className="text-white text-lg mb-4 text-center">
                Choose promotion piece:
              </h3>
              <div className="flex gap-4">
                {["q", "r", "b", "n"].map((piece) => (
                  <button
                    key={piece}
                    onClick={() => handlePromotion(piece)}
                    className="w-16 h-16 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors duration-200"
                  >
                    <span className="text-4xl text-white">
                      {pieceSymbols[piece]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameBoard;
