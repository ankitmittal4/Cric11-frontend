import React, { useEffect, useState } from "react";
import axios from "axios";

const Teams = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      //   const response = await axios.get("/api/teams");
      //   setTeams(response.data);
    };
    fetchTeams();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Teams</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <div key={team._id} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold">{team.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Teams;
