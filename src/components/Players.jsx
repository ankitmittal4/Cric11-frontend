import React, { useEffect, useState } from "react";
import axios from "axios";

const Players = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      // const response = await axios.get("/api/players");
      // setPlayers(response.data);
    };
    fetchPlayers();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Players</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {players.map((player) => (
          <div key={player._id} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold">{player.name}</h2>
            <p>Team: {player.team}</p>
            <p>Role: {player.role}</p>
            <p>Credits: {player.credits}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Players;
