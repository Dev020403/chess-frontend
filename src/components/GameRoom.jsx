import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Chessboard } from "react-chessboard";
import { CopyIcon, Share2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import io from "socket.io-client";
import axios from "axios";
import PlayerCard from "./PlayerCard";
import GameControls from "./GameControls";
import DrawOffer from "./DrawOffer";

const SOCKET_SERVER =
  process.env.REACT_APP_SOCKET_SERVER || "http://localhost:8080";
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

const GameRoom = () => {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [whitePlayer, setWhitePlayer] = useState(null);
  const [blackPlayer, setBlackPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [userColor, setUserColor] = useState(null);
  const [copied, setCopied] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const fetchGame = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/game/${gameId}`);
      setGame(response.data.game);
      setWhitePlayer(response.data.game.whitePlayer);
      setBlackPlayer(response.data.game.blackPlayer);

      // Determine user's color
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
    const newSocket = io(SOCKET_SERVER);
    setSocket(newSocket);

    fetchGame();

    // Join game room
    newSocket.emit("joinGame", gameId, currentUser._id);

    // Socket event handlers
    const socketHandlers = {
      // Game started event
      gameStarted: ({ game: updatedGame, joinedPlayer }) => {
        setGame((prevGame) => ({ ...prevGame, ...updatedGame }));
        const playerName =
          joinedPlayer.id === currentUser._id ? "You" : "Your opponent";
        toast.info(`${playerName} joined as ${joinedPlayer.color}`);
        fetchGame();
      },
      // Player joined event
      playerJoined: ({ playerId, assignedColor }) => {
        if (playerId !== currentUser._id) {
          if (assignedColor === "white") {
            setWhitePlayer({ _id: playerId });
          } else {
            setBlackPlayer({ _id: playerId });
          }
          toast.info("Opponent joined the game");
        }
        fetchGame();
      },

      // Move made event
      moveMade: ({ game: updatedGame, boardState }) => {
        setGame((prevGame) => ({ ...prevGame, ...updatedGame }));
      },

      // Draw events
      drawOffered: ({ game: updatedGame, offeredBy }) => {
        setGame((prevGame) => ({ ...prevGame, ...updatedGame }));
        if (offeredBy !== currentUser._id) {
          toast.info("Your opponent has offered a draw", {
            action: {
              accept: () => respondToDrawOffer(true),
              decline: () => respondToDrawOffer(false),
            },
          });
        }
      },

      drawResponse: ({ game: updatedGame, accepted, respondedBy }) => {
        setGame((prevGame) => ({ ...prevGame, ...updatedGame }));
        if (respondedBy !== currentUser._id) {
          toast.info(
            accepted
              ? "Opponent accepted draw - Game Over!"
              : "Opponent declined draw"
          );
        }
      },

      // Resignation event
      gameResigned: ({ game: updatedGame, resignedBy, winner }) => {
        setGame((prevGame) => ({ ...prevGame, ...updatedGame }));
        if (resignedBy === currentUser._id) {
          toast.info("You resigned the game");
        } else {
          toast.info("Opponent resigned - You win!");
        }
      },
    };

    // Register all socket event handlers
    Object.entries(socketHandlers).forEach(([event, handler]) => {
      newSocket.on(event, handler);
    });

    // Cleanup function
    return () => {
      Object.keys(socketHandlers).forEach((event) => {
        newSocket.off(event);
      });
      newSocket.emit("leaveGame", gameId);
      newSocket.disconnect();
    };
  }, [gameId, currentUser._id]);

  const onDrop = async (sourceSquare, targetSquare) => {
    if (!socket) return false;

    // Ensure both players have joined the game
    if (!whitePlayer || !blackPlayer) {
      toast.error("Waiting for both players to join before starting the game.");
      return false;
    }

    // Check if game and FEN string are available
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
      const response = await axios.post(`${API_BASE_URL}/game/${gameId}/move`, {
        from: sourceSquare,
        to: targetSquare,
      });

      if (response.data.message === "Move made successfully") {
        // Server will emit moveMade event to all players
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
        `${API_BASE_URL}/game/${gameId}/resign`,
        { playerId: currentUser._id }
      );

      // Server will emit gameResigned event to all players
      setGame(response.data.game);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resign");
    }
  };

  const offerDraw = async () => {
    if (!socket) return;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/game/${gameId}/offer-draw`,
        { playerId: currentUser._id }
      );

      // Server will emit drawOffered event to all players
      setGame(response.data.game);
      toast.success("Draw offer sent");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to offer draw");
    }
  };

  const respondToDrawOffer = async (accept) => {
    if (!socket) return;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/game/${gameId}/respond-draw`,
        {
          playerId: currentUser._id,
          accept,
        }
      );

      // Server will emit drawResponse event to all players
      setGame(response.data.game);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to respond to draw");
    }
  };

  const copyGameLink = () => {
    navigator.clipboard.writeText(`http://localhost:3000/game/room/${gameId}`);
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

      <div className="max-w-6xl mx-auto space-y-6 relative z-10">
        {/* Header Content */}
        <div className="flex justify-between items-center px-4">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="text-purple-400">♕</span>
            Chess Match
            <span className="text-purple-400">♔</span>
          </h1>
          <button
            onClick={copyGameLink}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 rounded-lg text-white transition-all duration-300"
          >
            {copied ? (
              <CopyIcon className="w-4 h-4 text-green-500" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
            <span>{copied ? "Copied!" : "Share Game"}</span>
          </button>
        </div>

        {/* Game Status */}
        {game.status === "completed" && (
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
        )}

        {/* Game Container */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="space-y-4 bg-gray-900 p-6 rounded-lg border border-purple-500/20">
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

          {/* Chess Board */}
          <div className="lg:col-span-2 bg-gray-900 p-6 rounded-lg border border-purple-500/20">
            <div className="relative aspect-square">
              <Chessboard
                arePiecesDraggable={isGameActive ? true : false}
                position={game.fen}
                onPieceDrop={isGameActive ? onDrop : null}
                boardOrientation={userColor}
                customBoardStyle={{
                  borderRadius: "0.5rem",
                  boxShadow: "0 0 20px rgba(147, 51, 234, 0.1)",
                  border: "1px solid rgba(147, 51, 234, 0.2)",
                }}
              />
            </div>
          </div>

          {/* Right Sidebar - Game Controls */}
          <div className="space-y-4 bg-gray-900 p-6 rounded-lg border border-purple-500/20">
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
        </div>
      </div>
      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
};

export default GameRoom;
