import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const limit = 10;
  const navigate = useNavigate();
  const handleCreateContest = (matchId, t1, t2) => {
    // console.log("matchId: ", matchId);
    // console.log(t1, ":", t2);
    const matchDetails = {
      t1,
      t2,
    };
    navigate(`create-contest/${matchId}`, { state: matchDetails });
  };

  const fetchMatches = async (page) => {
    setLoading(true);

    const upcomingMatchesApiEndpoint = "cricScore";

    // const apiKey = "514f076f-7982-4057-af93-a67492703940";
    // const apiKey = "46bdd8c8-e5a0-4e69-b610-3d78d92ee081";
    // const apiKey = "f526c20d-e2b2-4410-9f53-20c008f311df";

    // const apiKey = "b07addfd-8d5b-45e5-8c6c-3e8170c93f4c";
    const apiKey = "4ef4f3fd-defa-4095-9983-13f81c289499";
    const upcomingMatchesApiUrl = `https://api.cricapi.com/v1/${upcomingMatchesApiEndpoint}?apikey=${apiKey}`;
    const upcomingMatches = await axios.get(upcomingMatchesApiUrl);
    if (
      !(upcomingMatches.data.status === "success") ||
      !upcomingMatches.data.data.length
    ) {
      console.error("Error while fetching matches");
    }

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const formatDate = (date) => date.toISOString().split("T")[0];
    const todayStr = formatDate(today);
    const tomorrowStr = formatDate(tomorrow);

    const filteredMatches = upcomingMatches.data.data
      .filter((match) => {
        const matchTimeGMT = match.dateTimeGMT;
        const matchDateGMT = new Date(matchTimeGMT);
        const ISTOffset = 5.5 * 60 * 60 * 1000;
        const matchTimeIST = new Date(matchDateGMT.getTime() + ISTOffset);
        const matchTimeISTStr = matchTimeIST
          .toISOString()
          .replace("Z", "")
          .replace("T", " ")
          .slice(0, 10);
        return (
          match.ms === "fixture" &&
          (matchTimeISTStr === todayStr || matchTimeISTStr === tomorrowStr)
        );
      })
      .map((match) => {
        const matchTimeGMT = match.dateTimeGMT;
        const matchDateGMT = new Date(matchTimeGMT);
        const ISTOffset = 5.5 * 60 * 60 * 1000;
        const matchTimeIST = new Date(matchDateGMT.getTime() + ISTOffset);

        const matchDate = matchTimeGMT.slice(0, 10);
        const matchTimeISTStr = matchTimeIST.toTimeString().slice(0, 8);
        // console.log("matchTimeIST: ", matchTimeISTStr);

        return {
          ...match,
          date: matchDate,
          time: matchTimeISTStr,
        };
      });
    filteredMatches.reverse();
    // console.log("FilteredMatches: ", filteredMatches);
    const totalMatches = filteredMatches.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginateMatches = filteredMatches.slice(startIndex, endIndex);
    // const { users, currentPage, totalPages } = dummyUsers;
    setMatches(paginateMatches);
    // setCurrentPage(currentPage);
    setTotalPages(Math.ceil(totalMatches / limit));
    setLoading(false);
  };
  useEffect(() => {
    fetchMatches(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  return (
    <>
      <h2 className="text-2xl font-bold mb-5">All Upcoming Matches</h2>
      <div className="bg-gray-800 w-full rounded-lg">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <table className="min-w-full bg-gray-800 rounded-lg">
              <thead>
                <tr className="text-left ">
                  <th className="py-2 text-xl px-4 border-b">Team1</th>
                  <th className="py-2 text-xl border-b">Team2</th>
                  <th className="py-2 text-xl border-b">Date</th>
                  <th className="py-2 text-xl border-b">Time</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((match) => (
                  <tr
                    key={match.id}
                    className="text-md hover:bg-gray-700 cursor-pointer"
                    onClick={() =>
                      handleCreateContest(match.id, match.t1, match.t2)
                    }
                  >
                    <td className="py-2 px-4">{match.t1}</td>
                    <td className="py-2">{match.t2}</td>
                    <td className="py-2">{match.date}</td>
                    <td className="py-2">{match.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between items-center mt-5">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 ml-10 mb-8 mt-6 bg-gray-600 rounded disabled:opacity-50 "
              >
                Previous
              </button>
              <span className="text-black">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 mr-10 mb-8 mt-6 bg-gray-600 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Matches;
