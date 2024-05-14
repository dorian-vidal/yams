import React from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  const handleStartGame = () => {
    navigate("/connexion");
  };

  return (
    <div className="home-page">
      <h1>Bienvenue sur notre jeu de Yams!</h1>
      <button onClick={handleStartGame} className="btn btn-primary">
        Commencer le jeu
      </button>
    </div>
  );
}

export default HomePage;
