import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const UserTeams = () => {
  const [contests, setContests] = useState([]);
  useEffect(() => {
    const fetchContests = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(
        "http://localhost:8000/api/v1/user-contest/all",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setContests(response.data.data);
    };
    fetchContests();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-600">User Contests</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {contests.map((contest) => (
          <Link
            to={`/my-contests/${contest._id}`}
            key={contest._id}
            className="mb-2 p-4 rounded-lg shadow-md border-2 border-gray-400 bg-gray-100 hover:bg-gray-200"
          >
            <h2 className="text-xl font-bold text-center text-gray-600 mb-1 ">
              {contest.matchId.name}
            </h2>
            <p className="text-center  text-xs text-red-600 font-bold">
              {contest.matchId.date.split("-").reverse().join("-")}
              <br></br>
              {contest.matchId.startTime}
            </p>
            <div className="flex justify-between">
              <p className="text-black mt-4">
                Prize Pool:{" "}
                <span className="font-semibold text-xl">
                  ₹{contest.contestId.prizePool}
                </span>
              </p>
              <p className="text-white mt-4 bg-green-600 px-3 py-1 rounded-md">
                Entry:{" "}
                <span className="font-medium">
                  ₹{contest.contestId.entryFee}
                </span>
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-black mt-4">
                Spots:{" "}
                <span className="font-semibold">
                  {contest.contestId.maxParticipants}
                </span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UserTeams;
