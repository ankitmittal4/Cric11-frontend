import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const ContestDetails = () => {
  const { id } = useParams(); // Get the contest ID from the URL
  const [contest, setContest] = useState(null);
  const [players, setPlayers] = useState([]); // Assuming you want to select players

  const [error, setError] = useState("");

  const [selectedPlayerIds, setSelectedPlayerIds] = useState([]);
  const [captainId, setCaptainId] = useState(null);
  const [viceCaptainId, setViceCaptainId] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePlayerSelection = (playerId) => {
    setSelectedPlayerIds((prev) => {
      const isSelected = prev.includes(playerId);
      if (isSelected) {
        return prev.filter((id) => id !== playerId);
      } else if (prev.length < 11) {
        return [...prev, playerId];
      } else if (prev.length >= 11) {
        setError("You can only select up to 11 players");
      }
      return prev;
    });
  };

  const handleCaptainChange = (playerId) => {
    setCaptainId(playerId);
    if (!selectedPlayerIds.includes(playerId)) {
      handlePlayerSelection(playerId);
    }
  };

  const handleViceCaptainChange = (playerId) => {
    setViceCaptainId(playerId);
    if (!selectedPlayerIds.includes(playerId)) {
      handlePlayerSelection(playerId);
    }
  };

  const isPlayerSelected = (playerId) => selectedPlayerIds.includes(playerId);

  // const handleSubmitTeam = (e) => {
  //   e.preventDefault();
  //   setSubmittedTeam({
  //     selectedPlayers: selectedPlayerIds,
  //     captain: selectedPlayerIds.find((player) => captainId === player._id),
  //     viceCaptain: selectedPlayerIds.find(
  //       (player) => viceCaptainId === player._id
  //     ),
  //   });
  //   setIsTeamSubmit(true);
  // };

  //TODO: Validation on submit
  const handleSubmitTeam = (e) => {
    e.preventDefault();
    //validation for captain and vc present
    if (selectedPlayerIds.length < 11) {
      setError("Select exactly 11 players");
      return;
    }
    if (!captainId || !selectedPlayerIds.includes(captainId)) {
      setError("Captain is mandatory");
      return;
    }
    if (!viceCaptainId || !selectedPlayerIds.includes(viceCaptainId)) {
      setError("Vice-Captain is mandatory");
      return;
    }
    // if () {
    //   setError("Captain is not in playing 11");
    //   return;
    // }
    // if () {
    //   setError("Vice-Captain is not in playing 11");
    //   return;
    // }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeErrorPopup = () => {
    setError("");
  };

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
        { _id: "11", name: "Quinton", role: "Bowler" },
        { _id: "12", name: "Kane Williamsin", role: "Bowler" },
        { _id: "13", name: "NickyP", role: "Bowler" },
        { _id: "14", name: "Steven Smith", role: "Bowler" },
        { _id: "15", name: "Starc", role: "Bowler" },
        { _id: "16", name: "Cummins", role: "Bowler" },
        { _id: "17", name: "Stokes", role: "Bowler" },
        { _id: "18", name: "Jofra", role: "Bowler" },
        { _id: "19", name: "Miller", role: "Bowler" },
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
          <h2 className="text-xl font-bold text-center mb-7">
            Selected Players: {selectedPlayerIds.length} / 11
          </h2>
          <form className="" onSubmit={handleSubmitTeam}>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300 rounded-3xl">
                <thead>
                  <tr className="text-left border-b-2 bg-slate-200">
                    <th className="py-2 text-md px-4 w-44">Player Name</th>
                    <th className="px-4 ">Role</th>
                    <th className="py-2 px-4">Captain (C)</th>
                    <th className="py-2 px-4">Vice-Captain (VC)</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player) => (
                    <tr
                      key={player._id}
                      className={`cursor-pointer  ${
                        isPlayerSelected(player._id)
                          ? "bg-yellow-100"
                          : "hover:bg-fuchsia-100"
                      }`}
                      onClick={() => handlePlayerSelection(player._id)}
                      // onClick={handlePlayerSelection(player._id)}
                    >
                      <td className="py-2 px-4 border-b">{player.name}</td>
                      <td className="py-2 px-4 border-b">{player.role}</td>
                      <td className="py-2 px-4 border-b text-center">
                        <input
                          type="radio"
                          name="captain"
                          value={player._id}
                          checked={captainId === player._id}
                          onClick={(e) => e.stopPropagation()}
                          onChange={() => handleCaptainChange(player._id)}
                          className="h-4 w-4"
                          disabled={
                            !isPlayerSelected(player._id) ||
                            viceCaptainId === player._id
                          }
                        />
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        <input
                          type="radio"
                          name="viceCaptain"
                          value={player._id}
                          checked={viceCaptainId === player._id}
                          onClick={(e) => e.stopPropagation()}
                          onChange={() => handleViceCaptainChange(player._id)}
                          className="h-4 w-4"
                          disabled={
                            !isPlayerSelected(player._id) ||
                            captainId === player._id
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* //Display error popup  */}
            {error && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-6 pl-9 pr-9 rounded-lg shadow-lg">
                  <h2 className="text-xl font-bold mb-5">Error</h2>
                  <p>{error}</p>
                  <button
                    onClick={closeErrorPopup}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded mt-10 mb-11 mx-auto block hover:bg-green-700"
            >
              Submit Team
            </button>
          </form>

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-green-500 p-6 rounded-lg w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
                  Team Preview
                </h2>

                <div className="flex justify-center gap-24 mt-8 mb-7">
                  {selectedPlayerIds.slice(0, 2).map((id) => {
                    const player = players.find((p) => p._id === id);
                    return (
                      <div key={player._id} className="text-center">
                        <FontAwesomeIcon
                          icon={faUser}
                          className="text-green-900 text-3xl"
                        />{" "}
                        {captainId === player._id && (
                          <span className="text-sm text-black font-semibold">
                            (C)
                          </span>
                        )}
                        {viceCaptainId === player._id && (
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
                  <div key={index} className="grid grid-cols-3 gap-20 mt-12 ">
                    {selectedPlayerIds
                      .slice(startIdx, startIdx + 3)
                      .map((id) => {
                        const player = players.find((p) => p._id === id);
                        return (
                          <div key={player._id} className="text-center">
                            <FontAwesomeIcon
                              icon={faUser}
                              className="text-green-900 text-3xl"
                            />{" "}
                            {captainId === player._id && (
                              <span className="text-sm text-black font-semibold">
                                (C)
                              </span>
                            )}
                            {viceCaptainId === player._id && (
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

                <hr className="mt-10 "></hr>
                <div className="flex mt-5">
                  <button
                    className="bg-green-800 text-white px-4 py-2 rounded mt-4 mx-auto block hover:bg-green-700 "
                    // onClick={handleJoinContest}
                  >
                    Join Contest
                  </button>
                  <button
                    className="bg-red-700 text-white px-5 py-2 rounded mt-4 mx-auto block hover:bg-red-600"
                    onClick={closeModal}
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ContestDetails;
