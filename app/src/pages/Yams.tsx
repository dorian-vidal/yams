import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function YamsPage() {
  const [dices, setDices] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isRolling, setIsRolling] = useState(false); // Ajout de l'état pour contrôler l'animation
  const [error, setError] = useState("");
  const [combination, setCombination] = useState("");
  const [gameMessage, setGameMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        if (response.data.gameAvailable === false) {
          navigate("/results");
        } else if (response.data.game) {
          setDices(response.data.game.dices);
          setAttempts(response.data.game.attemptsLeft);
          setCombination(response.data.game.combination);
          setGameMessage(response.data.message);
        } else {
          setGameMessage("Ready to start a new game.");
        }
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch game data. Please try again.");
        console.error(error);
        setLoading(false);
      });
  }, [navigate]);

  const launchDices = () => {
    if (attempts > 0) {
      setLoading(true);
      setIsRolling(true); // Commencer l'animation
      setError("");
      axios
        .post(
          "http://localhost:8080/play",
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          setDices(response.data.rolls);
          setCombination(response.data.combination);
          setAttempts(response.data.attemptsLeft);
          setLoading(false);
        })
        .catch((error) => {
          setError("Failed to launch dices. Please try again.");
          console.error(error);
          setLoading(false);
        })
        .finally(() => {
          setIsRolling(false); // Arrêter l'animation
          setLoading(false);
        });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <h1>Yam's</h1>

      <p>{gameMessage}</p>
      <h3>
        {combination
          ? `Combination: ${combination}`
          : "Roll the dices to see the combination"}
      </h3>

      {dices.map((dice, index) => (
        <Dice key={index} value={dice} isRolling={isRolling} />
      ))}

      <div className="actions">
        <button onClick={launchDices} disabled={loading || attempts <= 0}>
          {loading ? "Launching..." : "Launch"}
        </button>
        <h3>Attempts remaining: {attempts}</h3>
        {attempts <= 0 && <p>No more attempts left.</p>}
      </div>
    </>
  );
}

function Dice({ value, isRolling }) {
  return (
    <div className="dice-container">
      <div className={`dice ${isRolling ? "dice-rolling" : ""}`}>{value}</div>
    </div>
  );
}

export default YamsPage;
