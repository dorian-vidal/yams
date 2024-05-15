import React, { useEffect, useState } from "react";
import axios from "axios";

interface WinningInterface {
  _id: string;
  name: string;
  image: string;
}

interface ResultsResponseInterface {
  _id: string;
  userId: {
    username: string;
  };
  winnings: WinningInterface[];
  createdAt: Date;
}

function ResultsPage() {
  const [results, setResults] = useState<ResultsResponseInterface[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/results", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setResults(response.data);
      })
      .catch((error) => console.error("Error fetching results:", error));
  }, []);

  return (
    <div className="results-container">
      <h1>Game Results</h1>
      <div className="results-list">
        {results.map((result) => (
          <div key={result._id} className="result-card">
            <div className="result-info">
              <p className="result-user">{result.userId.username}</p>
              <p className="result-date">
                {new Date(result.createdAt).toLocaleDateString()}
              </p>
            </div>
            <ul className="winnings-list">
              {result.winnings.map((winning) => (
                <li key={winning._id}>{winning.name}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResultsPage;
