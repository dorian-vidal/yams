import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/connexion");
  };

  return (
    <header>
      <Link className="link" to="/">
        Home
      </Link>
      <button className="btn btn-primary" onClick={handleLogout}>
        Disconnect
      </button>
    </header>
  );
}

export default Header;
