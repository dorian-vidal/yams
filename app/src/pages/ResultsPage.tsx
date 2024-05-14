import { useEffect, useState } from "react";
import axios from "axios";

interface WinningInterface {
  _id: string;
  name: string;
  image: string;
}

interface ResultsResponseInterface {
  _id: string;
  userId: {
    username: "dorian42@gmail.com";
  };
  winnings: WinningInterface[];
  createdAt: Date;
}

function ResultsPage() {
  const [results, setResults] = useState<ResultsResponseInterface[]>();

  useEffect(() => {
    axios
      .get("http://localhost:8080/results", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setResults(response.data);
      });
  }, []);

  return (
    <div>
      <h1>Game Results</h1>
      <ul>
        {results ? (
          results.map((result) => (
            <li key={result._id}>
              {result.userId.username} won
              {result.winnings.map((winning) => (
                <span key={winning._id}> {winning.name},</span>
              ))}
              on {new Date(result.createdAt).toLocaleDateString()}
            </li>
          ))
        ) : (
          <></>
        )}
      </ul>
    </div>
  );
}

export default ResultsPage;
