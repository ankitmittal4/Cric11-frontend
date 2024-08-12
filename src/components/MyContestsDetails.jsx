import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const UserContestDetails = () => {
  const { id } = useParams(); // Get the contest ID from the URL
  const [contest, setContest] = useState(null);
  const [players, setPlayers] = useState([]); // Assuming you want to select players

  useEffect(() => {
    const fetchContestDetails = async () => {
      // const response = await axios.get(`/api/contests/${id}`);
      // setContest(response.data);

      // Mock data for demonstration
      const response = {
        _id: id,
        name: "India vs sri-Lanka",
        prizePool: "10000",
        entry: "49",
        spots: "200",
        spotsLeft: "123",
        time: "Today 07:00 PM",
        description: "Detailed information about the contest",
      };
      setContest(response);

      // Fetch players for team selection (mock data)
      const playersResponse = [
        {
          _id: "1",
          name: "Rohit",
          role: "Batsman",
          isCaptain: true,
          isVC: false,
        },
        {
          _id: "2",
          name: "Virat",
          role: "Batsman",
          isCaptain: false,
          isVC: false,
        },
        {
          _id: "3",
          name: "KL Rahul",
          role: "Batsman",
          isCaptain: false,
          isVC: false,
        },
        {
          _id: "4",
          name: "Jaiswal",
          role: "Batsman",
          isCaptain: false,
          isVC: false,
        },
        {
          _id: "5",
          name: "Sky",
          role: "Batsman",
          isCaptain: false,
          isVC: true,
        },
        {
          _id: "6",
          name: "Hardik",
          role: "All-rounder",
          isCaptain: false,
          isVC: false,
        },
        {
          _id: "7",
          name: "Rinku",
          role: "Batsman",
          isCaptain: false,
          isVC: false,
        },
        {
          _id: "8",
          name: "Dube",
          role: "All-rounder",
          isCaptain: false,
          isVC: false,
        },
        {
          _id: "9",
          name: "Jasprit",
          role: "Bowler",
          isCaptain: false,
          isVC: false,
        },
        {
          _id: "10",
          name: "Arshdeep",
          role: "Bowler",
          isCaptain: false,
          isVC: false,
        },
        {
          _id: "11",
          name: "Steven Smith",
          role: "Bowler",
          isCaptain: false,
          isVC: false,
        },
        // Add more players as needed
      ];
      setPlayers(playersResponse);
    };

    fetchContestDetails();
  }, [id]);

  if (!contest) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-10 text-gray-600 text-center">
        {contest.name}
      </h1>
      {/* <p className="mb-4 text-gray-700">{contest.description}</p> */}
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 p-4">
          <h2 className="text-2xl font-bold mb-8">Contest Details:</h2>
          <p className="text-black mt-4 text-xl">
            Time: <span className="font-semibold">{contest.time}</span>
          </p>
          <p className="text-black mt-4 text-xl">
            Prize Pool:{" "}
            <span className="font-semibold text-red-600">
              ₹{contest.prizePool}
            </span>
          </p>
          <p className="text-black mt-4  text-xl">
            Entry:{" "}
            <span className="font-semibold text-green-700">
              ₹{contest.entry}
            </span>
          </p>
          <p className="text-black mt-4  text-xl">
            Rank: <span className="font-semibold text-blue-700">{7}</span>
          </p>
        </div>
        <div className="md:w-1/2">
          <h2 className="text-xl font-bold text-center mb-1 text-green-500">
            Total Points: <span className="text-3xl text-green-600">{728}</span>
          </h2>
          <div className="  bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-green-500 p-6 rounded-lg w-full max-w-lg">
              <div className="flex justify-center gap-24 mt-8 mb-7">
                {players.slice(0, 2).map((player) => {
                  return (
                    <div key={player._id} className="text-center">
                      <FontAwesomeIcon
                        icon={faUser}
                        className="text-green-800 text-3xl"
                      />{" "}
                      {player.isCaptain && (
                        <span className="text-sm text-black font-semibold">
                          (C)
                        </span>
                      )}
                      {player.isVC && (
                        <span className="text-sm font-semibold text-black">
                          (VC)
                        </span>
                      )}
                      <span className="block text-white px-6 rounded-sm py-px bg-red-600 text-sm">
                        {player.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              {[2, 5, 8].map((startIdx, index) => (
                <div key={index} className="grid grid-cols-3 gap-20 mt-16 ">
                  {players.slice(startIdx, startIdx + 3).map((player) => {
                    return (
                      <div key={player._id} className="text-center">
                        <FontAwesomeIcon
                          icon={faUser}
                          className="text-green-800 text-3xl"
                        />{" "}
                        {player.isCaptain && (
                          <span className="text-sm text-black font-semibold">
                            (C)
                          </span>
                        )}
                        {player.isVC && (
                          <span className="text-sm font-semibold text-black">
                            (VC)
                          </span>
                        )}
                        <span className="block text-white rounded-sm py-px bg-red-600 text-sm">
                          {player.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
              <div className="mt-10"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserContestDetails;
