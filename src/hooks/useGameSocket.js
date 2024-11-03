import { useEffect, useState } from "react";
import io from "socket.io-client";
import { toast } from "react-toastify";
import axios from "axios";

const SOCKET_SERVER = process.env.REACT_APP_SOCKET_SERVER || "http://localhost:8080";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

const useGameSocket = (gameId, currentUser, fetchGame, setGame, setWhitePlayer, setBlackPlayer) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io(SOCKET_SERVER);
        setSocket(newSocket);

        // Join game room
        newSocket.emit("joinGame", gameId, currentUser._id);

        // Socket event handlers
        const socketHandlers = {
            gameStarted: ({ game: updatedGame, joinedPlayer }) => {
                setGame((prevGame) => ({ ...prevGame, ...updatedGame }));
                const playerName = joinedPlayer.id === currentUser._id ? "You" : "Your opponent";
                toast.info(`${playerName} joined as ${joinedPlayer.color}`);
                fetchGame();
            },
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
            moveMade: ({ game: updatedGame, boardState }) => {
                setGame((prevGame) => ({ ...prevGame, ...updatedGame }));
            },
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

    return { socket, respondToDrawOffer };
};

export default useGameSocket;
