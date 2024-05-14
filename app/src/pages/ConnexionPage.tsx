import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";

function ConnexionPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleGoToInscription = () => {
    navigate("/inscription");
  };

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    axios
      .post("http://localhost:8080/login", {
        username: username,
        password: password,
      })
      .then((response) => {
        console.log(response.data);
        localStorage.setItem("token", response.data.token);
        alert("Connexion réussie !");
        navigate("/yams");
      })
      .catch((error) => {
        console.error("Erreur de connexion:", error.response?.data);
        alert("Erreur de connexion !");
      });
  };

  return (
    <form onSubmit={handleLogin}>
      <h1>Connexion</h1>
      <div className="mb-3">
        <label htmlFor="usernameInput" className="form-label">
          Nom d'utilisateur
        </label>
        <input
          type="text"
          className="form-control"
          id="usernameInput"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="passwordInput" className="form-label">
          Mot de passe
        </label>
        <input
          type="password"
          className="form-control"
          id="passwordInput"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Connexion
      </button>
      <br />
      <p>
        Si vous n'avez pas de compte, vous pouvez
        <button onClick={handleGoToInscription} className="link-button">
          en créer un
        </button>
      </p>
    </form>
  );
}

export default ConnexionPage;
