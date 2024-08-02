import React, { useState } from "react";
import { useParams } from "react-router-dom";

const CreateContest = () => {
  const { matchId } = useParams();
  const [entryFee, setEntryFee] = useState("");
  const [prizePool, setPrizePool] = useState("");
  const [totalSpots, setTotalSpots] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Reset error message
    setErrorMessage("");

    const contestData = {
      matchId,
      entryFee,
      prizePool,
      totalSpots,
    };

    try {
      const response = await axios.post("/api/create-contest", contestData);

      // Handle successful creation
      alert("Contest created successfully!");
    } catch (error) {
      // Handle errors
      setErrorMessage(
        error.response?.data?.message || "Failed to create contest"
      );
    }
  };

  return (
    <div className="p-6 bg-gray-800 text-white rounded-md shadow-md">
      <h1 className="text-2xl mb-4">Create Contest for Match ID: {matchId}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1" htmlFor="entryFee">
            Entry Fee:
          </label>
          <input
            type="number"
            id="entryFee"
            value={entryFee}
            onChange={(e) => setEntryFee(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block mb-1" htmlFor="prizePool">
            Prize Pool:
          </label>
          <input
            type="number"
            id="prizePool"
            value={prizePool}
            onChange={(e) => setPrizePool(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block mb-1" htmlFor="totalSpots">
            Total Spots:
          </label>
          <input
            type="number"
            id="totalSpots"
            value={totalSpots}
            onChange={(e) => setTotalSpots(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md"
            required
          />
        </div>
        {errorMessage && <div className="text-red-500">{errorMessage}</div>}
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
        >
          Create Contest
        </button>
      </form>
    </div>
  );
};

export default CreateContest;
