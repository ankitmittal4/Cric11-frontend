import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import increase from '../assets/increase.png';
import clock from '../assets/clock.png';
const API_URL = import.meta.env.VITE_API_URL;
const UserTeams = () => {
    const [contests, setContests] = useState([]);
    const [activeTab, setActiveTab] = useState('Upcoming');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchContests = async () => {
            setLoading(true);
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.get(`${API_URL}/user-contest/all`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            setContests(response.data.data);
            setLoading(false);
            // console.log('contests: ', response.data.data);
        };
        fetchContests();
    }, []);
    const curTime = new Date();

    const filteredContests = contests.filter((contest) => {
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
    // console.log('Time:', contests);

    return (
        <div className="container mx-auto p-4">
            <div className="">
                {/* Tabs */}
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
                    {
                        loading ? (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                                <div className="w-10 h-10 border-4 border-gray-300 border-t-white rounded-full animate-spin"></div>
                            </div>
                        ) : (

                            filteredContests.length === 0 ? (

                                <h1 className="text-2xl text-center font-bold mb-6 text-gray-600 mt-[10%]">
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
                                                    <span className=''>{contest.matchDetails.series} </span> {" "}
                                                </div>
                                                <div className="flex justify-between w-full px-3 min-h-16 items-center">
                                                    <div className="w-1/2 flex justify-start">
                                                        <h2 className="text-xl font-bold text-gray-600 text-center">
                                                            {contest.matchDetails.teamB}
                                                        </h2>
                                                    </div>
                                                    <span className='mx-1'></span>
                                                    <div className="w-1/2 flex justify-end">
                                                        <h2 className="text-xl font-bold text-gray-600 text-center">
                                                            {contest.matchDetails.teamA}
                                                        </h2>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center px-4 my-1">
                                                    <div className="flex items-center space-x-2">
                                                        {contest.matchDetails.teamBImg && (
                                                            <img
                                                                src={contest.matchDetails.teamBImg}
                                                                alt="Team B"
                                                                className="h-11 object-contain"
                                                            />
                                                        )}

                                                        <p className="text-center font-bold text-stone-500">
                                                            {contest.matchDetails.teamBAcronym}
                                                        </p>
                                                    </div>
                                                    <p className="text-center  text-xs text-red-600 font-bold">
                                                        {contest.matchDetails.date
                                                            .split('-')
                                                            .reverse()
                                                            .join('-')}
                                                        <br></br>
                                                        <div className="mb-1 flex bg-red-100 px-2 py-1 rounded-md items-center">
                                                            <img src={clock} alt="" className='h-3 w-3 mr-1' />
                                                            <span className="font-extrabold ">
                                                                {convertIn12Hours(contest.matchDetails.startTime)}
                                                            </span>
                                                        </div>

                                                    </p>
                                                    <div className="flex items-center space-x-2">
                                                        <p className="text-center font-bold text-stone-500">
                                                            {contest.matchDetails.teamAAcronym}
                                                        </p>
                                                        {contest.matchDetails.teamAImg && (
                                                            <img
                                                                src={contest.matchDetails.teamAImg}
                                                                alt="Team A"
                                                                className="h-11 object-contain"
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
                                                        <div className="flex justify-center text-red-600 font-medium bg-slate-300 py-1 mt-1 border-t-[1px] border-slate-400">
                                                            Completed
                                                        </div>
                                                    ) : (
                                                        <div className="flex justify-center text-green-500 font-medium bg-slate-300 py-1 mt-1 border-t-[1px] border-slate-400">
                                                            Live
                                                        </div>
                                                    )
                                                ) : (
                                                    <div className="flex justify-center text-orange-500 font-medium bg-slate-300 py-1 mt-1 border-t-[1px] border-slate-400">
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

{/* <h1 className="text-2xl font-bold mb-6 text-gray-600">
    My Contests
</h1> */}
{/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {contests.length === 0 ? (
        <div className="flex justify-center col-span-full">
            <h1 className="text-2xl font-bold text-gray-800 text-center mt-10">
                No Contests Found...
            </h1>
        </div>
    ) : (
        contests.sort((a, b) => {
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
                    <span className=''>{contest.matchDetails.series} </span> {" "}
                </div>
                <div className="flex justify-between w-full px-3 min-h-16 items-center">
                    <div className="w-1/2 flex justify-start">
                        <h2 className="text-xl font-bold text-gray-600 text-center">
                            {contest.matchDetails.teamB}
                        </h2>
                    </div>
                    <span className='mx-1'></span>
                    <div className="w-1/2 flex justify-end">
                        <h2 className="text-xl font-bold text-gray-600 text-center">
                            {contest.matchDetails.teamA}
                        </h2>
                    </div>
                </div>
                <div className="flex justify-between items-center px-4 my-1">
                    <div className="flex items-center space-x-2">
                        {contest.matchDetails.teamBImg && (
                            <img
                                src={contest.matchDetails.teamBImg}
                                alt="Team B"
                                className="h-11 object-contain"
                            />
                        )}

                        <p className="text-center font-bold text-stone-500">
                            {contest.matchDetails.teamBAcronym}
                        </p>
                    </div>
                    <p className="text-center  text-xs text-red-600 font-bold">
                        {contest.matchDetails.date
                            .split('-')
                            .reverse()
                            .join('-')}
                        <br></br>
                        <div className="mb-1 flex bg-red-100 px-2 py-1 rounded-md items-center">
                            <img src={clock} alt="" className='h-3 w-3 mr-1' />
                            <span className="font-extrabold ">
                                {contest.matchDetails.startTime}
                            </span>
                        </div>

                    </p>
                    <div className="flex items-center space-x-2">
                        <p className="text-center font-bold text-stone-500">
                            {contest.matchDetails.teamAAcronym}
                        </p>
                        {contest.matchDetails.teamAImg && (
                            <img
                                src={contest.matchDetails.teamAImg}
                                alt="Team A"
                                className="h-11 object-contain"
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
                        <div className="flex justify-center text-red-600 font-medium bg-slate-300 py-1 mt-1 border-t-[1px] border-slate-400">
                            Completed
                        </div>
                    ) : (
                        <div className="flex justify-center text-green-500 font-medium bg-slate-300 py-1 mt-1 border-t-[1px] border-slate-400">
                            Live
                        </div>
                    )
                ) : (
                    <div className="flex justify-center text-orange-500 font-medium bg-slate-300 py-1 mt-1 border-t-[1px] border-slate-400">
                        Upcoming
                    </div>
                )}
            </Link>
        ))
    )}
</div> */}