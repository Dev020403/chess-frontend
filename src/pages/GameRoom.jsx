// GameRoom.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GameHeader from "../components/GameHeader";
import GameStatus from "../components/GameStatus";
import GameBoard from "../components/GameBoard";
import PlayerCard from "../components/PlayerCard";
import GameControls from "../components/GameControls";
import DrawOffer from "../components/DrawOffer";
import MovesHistory from "../components/MoveHistory";
import useGameSocket from "../hooks/useGameSocket";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

const GameRoom = () => {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [whitePlayer, setWhitePlayer] = useState(null);
  const [blackPlayer, setBlackPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userColor, setUserColor] = useState(null);
  const [copied, setCopied] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const fetchGame = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/game/${gameId}`);
      setGame(response.data.game);
      setWhitePlayer(response.data.game.whitePlayer);
      setBlackPlayer(response.data.game.blackPlayer);

      if (response.data.game.whitePlayer?._id === currentUser._id) {
        setUserColor("white");
      } else if (response.data.game.blackPlayer?._id === currentUser._id) {
        setUserColor("black");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error loading game");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGame();
  }, [gameId]);

  const { socket, respondToDrawOffer } = useGameSocket(
    gameId,
    currentUser,
    fetchGame,
    setGame,
    setWhitePlayer,
    setBlackPlayer
  );

  const onDrop = async (sourceSquare, targetSquare, promotion = null) => {
    if (!socket) return false;

    if (!whitePlayer || !blackPlayer) {
      toast.error("Waiting for both players to join before starting the game.");
      return false;
    }

    if (!game || !game.fen) {
      toast.error("Game data not fully loaded yet.");
      return false;
    }

    const fenParts = game.fen.split(" ");
    const currentTurn = fenParts[1];
    const isPlayerTurn = currentTurn === (userColor === "white" ? "w" : "b");

    if (!isPlayerTurn) {
      toast.error("It's not your turn!");
      return false;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/game/${gameId}/move`, {
        from: sourceSquare,
        to: targetSquare,
        promotion, // Will be 'q', 'r', 'b', or 'n' for promotion moves
      });

      if (response.data.message === "Move made successfully") {
        setGame(response.data.game);
        return true;
      }
      return false;
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid move");
      return false;
    }
  };

  const resignGame = async () => {
    if (!socket) return;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/game/${gameId}/resign`,
        { playerId: currentUser._id }
      );

      setGame(response.data.game);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resign");
    }
  };

  const offerDraw = async () => {
    if (!socket) return;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/game/${gameId}/offer-draw`,
        { playerId: currentUser._id }
      );

      setGame(response.data.game);
      toast.success("Draw offer sent");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to offer draw");
    }
  };

  const copyGameLink = () => {
    navigator.clipboard.writeText(gameId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Game link copied!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const canRespondToDraw =
    game.drawOffer &&
    game.drawOffer.offeredBy !== currentUser._id &&
    game.status === "active";

  const isGameActive = game.status === "active";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-6 relative overflow-hidden">
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

      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        <GameHeader onCopyGameLink={copyGameLink} copied={copied} />
        <GameStatus game={game} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6">
          {/* Left Sidebar */}
          <div className="space-y-4">
            <div className="bg-gray-900/95 p-6 rounded-lg border flex flex-col gap-5 border-purple-500/20">
              <PlayerCard
                player={whitePlayer}
                color="white"
                isCurrentTurn={game.fen.split(" ")[1] === "w" && isGameActive}
              />
              <PlayerCard
                player={blackPlayer}
                color="black"
                isCurrentTurn={game.fen.split(" ")[1] === "b" && isGameActive}
              />
            </div>
            {isGameActive && (
              <GameControls
                onResign={resignGame}
                onOfferDraw={offerDraw}
                canOfferDraw={!game.drawOffer}
              />
            )}
            {canRespondToDraw && (
              <DrawOffer
                onAccept={() => respondToDrawOffer(true)}
                onDecline={() => respondToDrawOffer(false)}
              />
            )}
          </div>

          {/* Center - Game Board */}
          <div className="w-[640px]">
            <GameBoard
              game={game}
              userColor={userColor}
              onDrop={onDrop}
              isGameActive={isGameActive}
            />
          </div>

          {/* Right Sidebar - Moves History and Controls */}
          <div className="space-y-4">
            <MovesHistory moves={game.moveHistory || []} />
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
};

export default GameRoom;
