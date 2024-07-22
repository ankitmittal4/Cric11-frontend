import React, { useEffect, useState } from "react";
import axios from "axios";

const UserTeams = () => {
  const [userTeams, setUserTeams] = useState([]);

  useEffect(() => {
    const fetchUserTeams = async () => {
      // const response = await axios.get("/api/userTeams");
      // setUserTeams(response.data);
    };
    fetchUserTeams();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Teams</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {userTeams.map((userTeam) => (
          <div key={userTeam._id} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold">{userTeam.userId.name}</h2>
            <p>Contest: {userTeam.contestId.name}</p>
            <p>
              Match: {userTeam.matchId.teamA} vs {userTeam.matchId.teamB}
            </p>
            <p>
              Players:{" "}
              {userTeam.players.map((player) => player.name).join(", ")}
            </p>
            <p>Captain: {userTeam.captain.name}</p>
            <p>Vice Captain: {userTeam.viceCaptain.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserTeams;
