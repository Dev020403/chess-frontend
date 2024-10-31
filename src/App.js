import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthForm from "./components/LoginRegister";
import GameForm from "./components/GameForm";
import GameRoom from "./components/GameRoom";

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
