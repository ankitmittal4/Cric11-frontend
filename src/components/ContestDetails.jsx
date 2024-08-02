import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ContestDetails = () => {
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
        { _id: "1", name: "Rohit", role: "Batsman" },
        { _id: "2", name: "Virat", role: "Batsman" },
        { _id: "3", name: "KL Rahul", role: "Batsman" },
        { _id: "4", name: "Jaiswal", role: "Batsman" },
        { _id: "5", name: "Sky", role: "Batsman" },
        { _id: "6", name: "Hardik", role: "All-rounder" },
        { _id: "7", name: "Rinku", role: "Batsman" },
        { _id: "8", name: "Dube", role: "All-rounder" },
        { _id: "9", name: "Jasprit", role: "Bowler" },
        { _id: "10", name: "Arshdeep", role: "Bowler" },
        { _id: "10", name: "Arshdeep", role: "Bowler" },
        { _id: "10", name: "Arshdeep", role: "Bowler" },
        { _id: "10", name: "Arshdeep", role: "Bowler" },
        { _id: "10", name: "Arshdeep", role: "Bowler" },
        { _id: "10", name: "Arshdeep", role: "Bowler" },
        { _id: "10", name: "Arshdeep", role: "Bowler" },
        { _id: "10", name: "Arshdeep", role: "Bowler" },
        { _id: "10", name: "Arshdeep", role: "Bowler" },
        { _id: "10", name: "Arshdeep", role: "Bowler" },
        // Add more players as needed
      ];
      setPlayers(playersResponse);
    };

    fetchContestDetails();
  }, [id]);

  if (!contest) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-600 text-center">
        {contest.name}
      </h1>
      {/* <p className="mb-4 text-gray-700">{contest.description}</p> */}
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 p-4">
          <h2 className="text-xl font-bold">Contest Details</h2>
          <p className="text-black mt-4">
            Prize Pool:{" "}
            <span className="font-semibold">₹{contest.prizePool}</span>
          </p>
          <p className="text-black mt-4">
            Entry: <span className="font-semibold">₹{contest.entry}</span>
          </p>
          <p className="text-black mt-4">
            Spots: <span className="font-semibold">{contest.spots}</span>
          </p>
          <p className="text-black mt-4">
            Spots Left:{" "}
            <span className="text-red-500 font-bold">{contest.spotsLeft}</span>
          </p>
          <p className="text-black mt-4">
            Time: <span className="font-semibold">{contest.time}</span>
          </p>
        </div>
        <div className="md:w-1/2">
          <h2 className="text-xl font-bold text-center mb-7">Select Your 11</h2>
          <form className="">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {players.map((player) => (
                <div key={player._id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={player._id}
                    name="players"
                    value={player._id}
                    className="mr-2"
                  />
                  <label htmlFor={player._id} className="text-gray-700">
                    {player.name} ({player.role})
                  </label>
                </div>
              ))}
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4 mx-auto block"
            >
              Submit Team
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default ContestDetails;
