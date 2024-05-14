import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // Importez useNavigate pour la redirection
import "../App.css";

function YamsPage() {
  const [dices, setDices] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [combination, setCombination] = useState("");
  const [gameMessage, setGameMessage] = useState(""); // Pour stocker les messages du serveur
  const navigate = useNavigate(); // Hook pour gérer la navigation

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.data.gameAvailable === false) {
          // Si gameAvailable est false, redirigez vers la page de résultats
          navigate("/results");
        } else if (response.data.game) {
          setDices(response.data.game.dices);
          setAttempts(response.data.game.attemptsLeft);
          setCombination(response.data.game.combination);
          setGameMessage(response.data.message);
        } else {
          setGameMessage("Ready to start a new game.");
        }
      } catch (error) {
        setError("Failed to fetch game data. Please try again.");
        console.error(error);
      }
      setLoading(false);
    };

    fetchGameData();
  }, [navigate]); // Ajoutez navigate comme dépendance de useEffect pour garantir la réactivité

  const launchDices = async () => {
    if (attempts > 0) {
      setLoading(true);
      setError("");
      try {
        const response = await axios.post(
          "http://localhost:8080/play",
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setDices(response.data.rolls);
        setCombination(response.data.combination);
        // setAttempts(attempts - 1);
        setAttempts(response.data.attemptsLeft); // Mettre à jour le nombre de tentatives restantes avec la valeur du serveur
      } catch (error) {
        setError("Failed to launch dices. Please try again.");
        console.error(error);
      }
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <h1>Yam's</h1>

      <p>{gameMessage}</p>
      <p>
        {combination
          ? `Combination: ${combination}`
          : "Roll the dices to see the combination"}
      </p>

      {dices.map((dice, index) => (
        <Dice key={index} value={dice} />
      ))}

      <div className="actions">
        <button onClick={launchDices} disabled={loading || attempts <= 0}>
          {loading ? "Launching..." : "Launch"}
        </button>
        <p>Attempts remaining: {attempts}</p>
        {attempts <= 0 && <p>No more attempts left.</p>}
      </div>
      <Link to="/">Back to Home</Link>
      <br />
      <br />
    </>
  );
}

function Dice(props) {
  return (
    <div className="dice-container">
      <div className="dice">{props.value}</div>
    </div>
  );
}

export default YamsPage;
