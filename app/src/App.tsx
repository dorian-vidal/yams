import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ConnexionPage from "./pages/ConnexionPage.tsx";
import InscriptionPage from "./pages/InscriptionPage.tsx";
import ResultsPage from "./pages/ResultsPage.tsx";
import Yams from "./pages/Yams.tsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/yams" element={<Yams />} />
        <Route path="/connexion" element={<ConnexionPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/inscription" element={<InscriptionPage />} />
      </Routes>
    </Router>
  );
}

export default App;
