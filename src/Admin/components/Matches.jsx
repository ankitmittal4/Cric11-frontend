import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { format, toZonedTime } from 'date-fns-tz';

const Matches = () => {
    const [matches, setMatches] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const limit = 10;
    const navigate = useNavigate();
    useEffect(() => {
        if (!localStorage.getItem('adminAccessToken')) {
            navigate('/admin/signin');
        }
    }, []);
    const handleCreateContest = (matchId, t1, t2, t1img, t2img, series) => {
        const matchDetails = {
            t1,
            t2,
            t1img,
            t2img,
            series,
        };
        navigate(`create-contest/${matchId}`, { state: matchDetails });
    };

    const fetchMatches = async (page) => {
        setLoading(true);

        const upcomingMatchesApiEndpoint = 'cricScore';

        //NOTE: Working
        const apiKey = '4ef4f3fd-defa-4095-9983-13f81c289499';
        // const apiKey = 'b07addfd-8d5b-45e5-8c6c-3e8170c93f4c';

        const upcomingMatchesApiUrl = `https://api.cricapi.com/v1/${upcomingMatchesApiEndpoint}?apikey=${apiKey}`;
        const upcomingMatches = await axios.get(upcomingMatchesApiUrl);
        if (
            !(upcomingMatches.data.status === 'success') ||
            !upcomingMatches.data.data.length
        ) {
            console.error('Error while fetching matches');
        }

        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 20);

        const istTodayDate = toZonedTime(today, 'Asia/Kolkata');
        const istTomorrowDate = toZonedTime(tomorrow, 'Asia/Kolkata');

        const todayTimeStamp = istTodayDate.getTime();
        const tomorrowTimeStamp = istTomorrowDate.getTime();

        const filteredMatches = upcomingMatches.data.data
            .filter((match) => {
                const matchTimeGMT = match.dateTimeGMT;
                const matchDateGMT = new Date(matchTimeGMT + 'Z');

                const istMatchDate = toZonedTime(matchDateGMT, 'Asia/Kolkata');
                const matchTimeStamp = istMatchDate.getTime();

                return (
                    match.ms === 'fixture' &&
                    matchTimeStamp >= todayTimeStamp &&
                    matchTimeStamp <= tomorrowTimeStamp
                );
            })
            .map((match) => {
                const matchTimeGMT = match.dateTimeGMT;
                const matchDateGMT = new Date(matchTimeGMT + 'Z');
                const istMatchDate = toZonedTime(matchDateGMT, 'Asia/Kolkata');
                const formattedIstMatchDate = format(
                    istMatchDate,
                    'dd-MM-yyyy',
                    {
                        timeZone: 'Asia/Kolkata',
                    },
                );
                const formattedIstMatchTime = format(istMatchDate, 'HH:mm:ss', {
                    timeZone: 'Asia/Kolkata',
                });

                return {
                    ...match,
                    date: formattedIstMatchDate,
                    time: formattedIstMatchTime,
                };
            });
        filteredMatches.reverse();
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

    const convertIn12Hours = (time) => {
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours);

        const period = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${hours}:${minutes} ${period}`;
    }
    return (
        <>
            <h2 className="text-2xl font-bold mb-5">All Upcoming Matches</h2>
            <div className="bg-gray-800 w-full rounded-lg">
                {loading ? (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="w-10 h-10 border-4 border-gray-300 border-t-white rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div>
                        <table className="min-w-full bg-gray-800 rounded-lg">
                            <thead>
                                <tr className="text-left ">
                                    <th className="py-2 text-xl px-4 border-b">
                                        Team1
                                    </th>
                                    <th className="py-2 text-xl border-b">
                                        Team2
                                    </th>
                                    <th className="py-2 text-xl border-b">
                                        Date
                                    </th>
                                    <th className="py-2 text-xl border-b">
                                        Time
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {matches.map((match) => (
                                    <tr
                                        key={match.id}
                                        className="text-md hover:bg-gray-700 cursor-pointer"
                                        onClick={() =>
                                            handleCreateContest(
                                                match.id,
                                                match.t1,
                                                match.t2,
                                                match.t1img,
                                                match.t2img,
                                                match.series,
                                            )
                                        }
                                    >
                                        <td className="py-2 px-4">
                                            {match.t1}
                                        </td>
                                        <td className="py-2">{match.t2}</td>
                                        <td className="py-2">{match.date}</td>
                                        <td className="py-2">{convertIn12Hours(match.time)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="flex justify-between items-center mt-5">
                            <button
                                onClick={() =>
                                    handlePageChange(currentPage - 1)
                                }
                                disabled={currentPage === 1}
                                className="px-4 py-2 ml-10 mb-8 mt-6 bg-gray-600 rounded disabled:opacity-50 "
                            >
                                Previous
                            </button>
                            <span className="text-black">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() =>
                                    handlePageChange(currentPage + 1)
                                }
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
