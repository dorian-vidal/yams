import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";

function InscriptionPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    axios
      .post("http://localhost:8080/signup", {
        username: email,
        password: password,
      })
      .then((response) => {
        console.log(response.data);
        alert("Inscription réussie !");
        navigate("/yams");
      })
      .catch((error) => {
        console.error("Erreur d'inscription:", error.response?.data);
        alert("Erreur d'inscription !");
      });
  };

  return (
    <form onSubmit={handleRegister}>
      <h1>Inscription</h1>
      <div className="mb-3">
        <label htmlFor="emailInput" className="form-label">
          Adresse email
        </label>
        <input
          type="email"
          className="form-control"
          id="emailInput"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-describedby="emailHelp"
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
        S'inscrire
      </button>
    </form>
  );
}

export default InscriptionPage;
