import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [contests, setContests] = useState([]);

  useEffect(() => {
    const fetchContests = async () => {
      const response = await axios.get(
        "http://localhost:8000/api/v1/contests/all"
      );
      // console.log("response.data: ", response.data.data);
      setContests(response.data.data);
    };
    fetchContests();
  }, []);

  const date = new Date();
  const offsetIST = 5.5 * 60 * 60 * 1000;
  const istTime = new Date(date.getTime() + offsetIST);
  const istFormatted = istTime.toISOString().slice(0, 19);
  // console.log(istFormatted);
  // console.log(localeDateTime);
  // console.log("IsGreater: ", istFormatted > "2024-08-28T17:30:00");
  // "2024-08-28T16:09:33.303Z"

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-600">
        All Cricket Contests
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {contests
          .filter((contest) => {
            {
              const formattedIST = `${contest.match.date}T${contest.match.startTime}`;
              return istFormatted < formattedIST;
            }
            {
              /* return localeDateTime > formattedIST; */
            }
          })
          .map((contest) => (
            <Link
              to={`/${contest._id}`}
              key={contest._id}
              className="mb-2 p-4 rounded-lg shadow-md border-2 border-gray-400 bg-gray-100 hover:bg-gray-200"
            >
              <h2 className="text-xl font-bold text-center text-gray-600 mb-1 ">
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
                <p className="text-center  text-xs text-red-500 font-bold">
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
                  Entry:{" "}
                  <span className="font-medium">₹{contest.entryFee}</span>
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-black mt-4">
                  Spots:{" "}
                  <span className="font-semibold">
                    {contest.maxParticipants}
                  </span>
                </p>
                {/* <p className="text-black mt-4">
                Left Spots: <span className="text-red-500 font-bold">{12}</span>
              </p> */}
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Home;
