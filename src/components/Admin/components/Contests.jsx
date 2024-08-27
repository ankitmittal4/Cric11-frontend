import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Contests = () => {
  const [contests, setContests] = useState([]);
  useEffect(() => {
    const fetchContests = async () => {
      const response = await axios.get(
        "http://localhost:8000/api/v1/contests/all"
      );
      setContests(response.data.data);
    };
    fetchContests();
  }, []);

  const deleteContest = async (id) => {
    try {
      const response = await axios.delete(
        "http://localhost:8000/api/v1/contests/delete/",
        {
          data: { id },
        }
      );
      if (response.status === 200) {
        setContests((prevContests) =>
          prevContests.filter((contest) => contest._id !== id)
        );
        alert("Contest deleted Successfully");
      }
    } catch (error) {
      console.log("Error while deleting contest: ", error);
      alert("Failed to delete contest. Please try again.");
    }
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-white">Created Contests</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-x-14 gap-y-4">
        {contests.map((contest) => (
          <Link
            // to={`/${contest._id}`}
            key={contest._id}
            className="mb-2 p-4 rounded-lg shadow-md border-2 border-gray-600 bg-slate-400 hover:bg-slate-500"
          >
            <h2 className="text-xl font-bold text-center text-gray-900 mb-1 ">
              {contest.match.name}
            </h2>
            <div className="flex justify-between mt-4 mb-1">
              {contest.match.teamBImg ? (
                <img
                  src={contest.match.teamBImg}
                  alt="A"
                  className="your-css-class h-9"
                />
              ) : (
                <p></p>
              )}
              <p className="text-center  text-xs text-red-600 font-bold">
                {contest.match.date.split("-").reverse().join("-")}
                <br></br>
                {contest.match.startTime}
              </p>
              {contest.match.teamAImg ? (
                <img
                  src={contest.match.teamAImg}
                  alt="B"
                  className="your-css-class h-9"
                />
              ) : (
                <p></p>
              )}
            </div>
            <div className="flex justify-between">
              <p className="text-black mt-4">
                Prize Pool:{" "}
                <span className="font-semibold text-xl">
                  ₹{contest.prizePool}
                </span>
              </p>
              <p className="text-white mt-4 bg-green-600 px-3 py-1 rounded-md">
                Entry: <span className="font-medium">₹{contest.entryFee}</span>
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-black mt-4">
                Spots:{" "}
                <span className="font-semibold">{contest.maxParticipants}</span>
              </p>
              <button
                onClick={() => deleteContest(contest._id)}
                className="text-white bg-red-600 px-5 py-1 rounded-md mt-4 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Contests;
