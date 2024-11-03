import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthForm from "./pages/LoginRegister";
import GameForm from "./pages/GameForm";
import GameRoom from "./pages/GameRoom";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AuthForm />} />
                <Route path="/game/create" element={<GameForm />} />
                <Route path="/game/room/:gameId" element={<GameRoom />} />
            </Routes>
        </Router>
    );
};

export default App;
