import React, { useEffect, useState } from "react";
import axios from "axios";

const Matches = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      // const response = await axios.get("/api/matches");
      // setMatches(response.data);
    };
    fetchMatches();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Matches</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {matches.map((match) => (
          <div key={match._id} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold">
              {match.teamA} vs {match.teamB}
            </h2>
            <p>Start Time: {new Date(match.startTime).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Matches;
