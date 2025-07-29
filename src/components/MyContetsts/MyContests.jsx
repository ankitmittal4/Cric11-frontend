import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import increase from '../../assets/increase.png';
import clock from '../../assets/clock.png';
const API_URL = import.meta.env.VITE_API_URL;
const UserTeams = () => {
    const [contests, setContests] = useState([]);
    const [activeTab, setActiveTab] = useState('Upcoming');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchContests = async () => {
            try {
                setLoading(true);
                const accessToken = localStorage.getItem('accessToken');
                const response = await axios.get(`${API_URL}/user-contest/all`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setContests(response.data.data);
                // console.log('contests: ', response.data.data);
            }
            catch (err) {
                console.log("Error: ", err);
            } finally {
                setLoading(false);
            }
        };
        fetchContests();
    }, []);
    const curTime = new Date();

    const filteredContests = (contests || []).filter((contest) => {
        const status = contest.matchDetails.matchStarted
            ? contest.matchDetails.matchEnded
                ? 'Completed'
                : 'Live'
            : 'Upcoming';

        return status === activeTab;
    })
    const convertIn12Hours = (time) => {
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours);

        const period = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${hours}:${minutes} ${period}`;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="">

                <div className="flex justify-center mb-10">
                    <div className="flex bg-gray-100 rounded-full overflow-hidden shadow-md max-w-lg w-full ">
                        {["Upcoming", "Live", "Completed"].map((tab) => (
                            <button
                                key={tab}
                                className={`flex-1 px-6 py-2 text-sm font-semibold capitalize transition-colors duration-200 ${activeTab === tab
                                    ? "bg-white text-red-600 shadow"
                                    : "text-gray-600 hover:bg-gray-300"
                                    }`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="">
                    {loading ? (
                        <div className="container mx-auto p-4">

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[1, 2, 3, 4, 5].map((_, index) => (
                                    <div
                                        key={index}
                                        className="animate-pulse rounded-lg shadow-md border-2 border-gray-400 bg-gray-100 overflow-hidden p-4 space-y-4 min-h-44"
                                    >
                                        <div className="bg-gray-300 h-6 w-2/3 rounded-md"></div>

                                        <div className="flex justify-between items-center">
                                            <div className="h-6 w-1/3 bg-gray-300 rounded my-1"></div>
                                            <div className="h-6 w-1/3 bg-gray-300 rounded"></div>
                                        </div>

                                        <div className="flex justify-between items-center mt-6">
                                            <div className="flex items-center space-x-2">
                                                <div className="h-9 w-9 bg-gray-300 rounded-full"></div>
                                                <div className="h-4 w-12 bg-gray-300 rounded"></div>
                                            </div>

                                            <div className="text-center space-y-1">
                                                <div className="h-4 w-16 bg-gray-300 rounded mx-auto"></div>
                                                <div className="h-4 w-10 bg-gray-300 rounded mx-auto"></div>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <div className="h-4 w-12 bg-gray-300 rounded"></div>
                                                <div className="h-9 w-9 bg-gray-300 rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (

                        filteredContests.length === 0 ? (

                            <h1 className="text-xl sm:text-2xl text-center font-bold mb-6 text-gray-600 mt-[10%]">
                                No {activeTab} Contests
                            </h1>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {(
                                    filteredContests.sort((a, b) => {
                                        const dateA = new Date(`${a.matchDetails.date}T${a.matchDetails.startTime}`);
                                        const dateB = new Date(`${b.matchDetails.date}T${b.matchDetails.startTime}`);
                                        return dateA - dateB;
                                    }).map((contest) => (
                                        <Link
                                            to={`/my-contests/${contest._id}`}
                                            key={contest._id}
                                            className="mb-2 rounded-lg shadow-md border-2 border-gray-400 bg-gray-100 hover:bg-slate-200 overflow-hidden"
                                        >
                                            <div
                                                className="bg-orange-200 inline-block text-orange-600 text-sm font-semibold px-3 py-1 pr-10 mb-2 "
                                                style={{
                                                    clipPath:
                                                        'polygon(0 0, calc(100% - 20px) 0, 100% 35px, 100% 100%, 0% 100%)',
                                                }}
                                            >
                                                <span className='text-xs sm:text-sm'>{contest.matchDetails.series} </span> {" "}
                                            </div>
                                            <div className="flex justify-between items-center px-4 mt-2">
                                                <div className="flex items-center space-x-2">
                                                    {contest.matchDetails.teamBImg && (
                                                        <img
                                                            src={contest.matchDetails.teamBImg}
                                                            alt="Team B"
                                                            className="h-9 object-contain rounded-sm"
                                                        />
                                                    )}

                                                    <p className="text-center font-bold text-stone-500">
                                                        {contest.matchDetails.teamBAcronym}
                                                    </p>
                                                </div>
                                                <div className="text-center font-semibold text-xs text-red-600 sm:font-bold">
                                                    {contest.matchDetails.date
                                                        .split('-')
                                                        .reverse()
                                                        .join('-')}
                                                    <br></br>
                                                    <div className="mb-1 flex bg-red-100 px-2 py-1 rounded-md items-center mt-1">
                                                        <img src={clock} alt="" className='h-3 w-3 mr-1' />
                                                        <span className="sm:font-extrabold font-bold">
                                                            {convertIn12Hours(contest.matchDetails.startTime)}
                                                        </span>
                                                    </div>

                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <p className="text-center font-bold text-stone-500">
                                                        {contest.matchDetails.teamAAcronym}
                                                    </p>
                                                    {contest.matchDetails.teamAImg && (
                                                        <img
                                                            src={contest.matchDetails.teamAImg}
                                                            alt="Team A"
                                                            className="h-9 object-contain rounded-sm"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center px-4">
                                                <p className="mt-4 flex items-center text-fuchsia-900">
                                                    Prize Pool:{'    '}
                                                    <img src={increase} alt="" className='h-5 w-5 mr-1 ml-1' />
                                                    <span className="font-semibold text-xl ">
                                                        ₹{contest.contestDetails.prizePool}
                                                    </span>
                                                </p>
                                                <p className="text-white mt-4 bg-green-600 px-3 py-1 rounded-md">
                                                    Entry:{' '}
                                                    <span className="font-medium">
                                                        ₹{contest.contestDetails.entryFee}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="flex justify-between items-center px-4 text-fuchsia-900">
                                                <p className="mt-1">
                                                    Spots:{' '}
                                                    <span className="font-semibold ">
                                                        {contest.contestDetails.maxParticipants}
                                                    </span>
                                                </p>

                                            </div>

                                            {contest.matchDetails.matchStarted ? (
                                                contest.matchDetails.matchEnded ? (
                                                    <div className="flex justify-center text-red-600 font-medium bg-slate-300 py-1 mt-1 border-t-[1px] border-slate-400 text-xs sm:text-sm">
                                                        Completed
                                                    </div>
                                                ) : (
                                                    <div className="flex justify-center text-green-500 font-medium bg-slate-300 py-1 mt-1 border-t-[1px] border-slate-400 text-xs sm:text-sm">
                                                        Live
                                                    </div>
                                                )
                                            ) : (
                                                <div className="flex justify-center text-orange-500 font-medium bg-slate-300 py-1 mt-1 border-t-[1px] border-slate-400 text-xs sm:text-sm">
                                                    Upcoming
                                                </div>
                                            )}
                                        </Link>
                                    ))
                                )}
                            </div>
                        )
                    )
                    }
                </div>
            </div>
        </div>
    );
};

export default UserTeams;

