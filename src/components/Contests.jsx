import React, { useEffect, useState } from "react";
import axios from "axios";

const Contests = () => {
  const [contests, setContests] = useState([]);

  useEffect(() => {
    const fetchContests = async () => {
      // const response = await axios.get("/api/contests");
      // setContests(response.data);

      const response = [
        {
          _id: "1",
          name: "India vs sri-Lanka",
          prizePool: "10000",
          entry: "49",
          spots: "200",
          spotsLeft: "123",
        },
        {
          _id: "2",
          name: "India-W vs sri-Lanka-W",
          prizePool: "100000",
          entry: "49",
          spots: "2000",
          spotsLeft: "983",
        },
        {
          _id: "3",
          name: "SA vs PAK",
          prizePool: "1000",
          entry: "10",
          spots: "100",
          spotsLeft: "98",
        },
        {
          _id: "4",
          name: "West-Indies vs England",
          prizePool: "1000",
          entry: "20",
          spots: "50",
          spotsLeft: "32",
        },
      ];
      setContests(response);
    };
    fetchContests();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-600">
        All Cricket Contests
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {contests.map((contest) => (
          <div
            key={contest._id}
            className=" p-4 rounded-lg shadow-md border-2 border-gray-400 bg-gray-50"
          >
            <h2 className="text-xl font-bold text-center text-gray-600">
              {contest.name}
            </h2>
            <div className="flex justify-between">
              <p className="text-black mt-4">
                Prize Pool:{" "}
                <span className="font-semibold text-xl">
                  ₹{contest.prizePool}
                </span>
              </p>
              <p className="text-white mt-4 bg-green-600 px-3 py-1 rounded-md">
                Entry: <span className="font-medium">₹{contest.entry}</span>
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-black mt-4">
                Spots: <span className="font-semibold">{contest.spots}</span>
              </p>
              <p className="text-black mt-4">
                Left Spots:{" "}
                <span className="text-red-500 font-bold">
                  {contest.spotsLeft}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contests;
