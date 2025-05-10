import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import clock from '../assets/clock.png';
import increase from '../assets/increase.png';
const API_URL = import.meta.env.VITE_API_URL;

const ContestsInMatches = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [contests, setContests] = useState([]);
    const [matchName, setMatchName] = useState('');
    useEffect(() => {
        if (!localStorage.getItem('accessToken')) {
            navigate('/signin');
        }

        const fetchContests = async () => {
            const response = await axios.post(`${API_URL}/contests/all`, {
                id,
            });
            // console.log('response.data: ', response.data.data);
            setMatchName(response?.data?.data[0]?.match?.name);
            setContests(response?.data?.data);
        };
        fetchContests();
    }, []);

    const [timeLeft, setTimeLeft] = useState("");
    const getTimeLeft = (matchDate, matchTime) => {
        const matchStart = new Date(`${matchDate}T${matchTime}:00`);
        const now = new Date();


        // const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(now.getDate() + 1);
        if (matchStart.getDate() === tomorrow.getDate() &&
            matchStart.getMonth() === tomorrow.getMonth() &&
            matchStart.getFullYear() === tomorrow.getFullYear()) {
            console.log("tomorrow");
            return "tomorrow"
        }

        const diffMs = matchStart - now;
        if (diffMs > 24 * 60 * 60 * 1000) return null;

        const diffSec = Math.floor(diffMs / 1000);
        const hours = Math.floor(diffSec / 3600);
        const minutes = Math.floor((diffSec % 3600) / 60);
        const seconds = diffSec % 60;

        return `${hours > 0 ? `${hours}h` : ''} ${minutes > 0 ? `${minutes}m` : ''} ${seconds}s`;
    };
    useEffect(() => {
        const interval = setInterval(() => {
            const updated = getTimeLeft(
                contests[0].match.date,
                contests[0].match.startTime
            );
            setTimeLeft(updated);
        }, 1000);

        return () => clearInterval(interval);
    }, [contests[0]?.match?.date, contests[0]?.match?.startTime]);

    const convertIn12Hours = (time) => {
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours);

        const period = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${hours}:${minutes} ${period}`;
    }
    if (!contests.length)
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="w-10 h-10 border-4 border-gray-300 border-t-white rounded-full animate-spin"></div>
            </div>
        );

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-7 text-gray-600 text-center">

                <span className="text-3xl text-slate-500"> {matchName}</span>
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {' '}
                {contests.map((contest) => (
                    <Link
                        to={`/match/${id}/contest/${contest._id}`}
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
                            <span className='uppercase'>{contest.match.matchType}</span> {" "}
                            Mega Contest
                        </div>



                        <div className="flex justify-between items-center mt-2 px-4">
                            <div className="flex items-center space-x-2">
                                {contest.match.teamBImg && (
                                    <img
                                        src={contest.match.teamBImg}
                                        alt="Team B"
                                        className="h-9 object-contain"
                                    />
                                )}

                                <p className="text-center font-bold text-stone-500">
                                    {contest.match.teamBAcronym}
                                </p>
                            </div>

                            {(() => {
                                const timeLeft = getTimeLeft(
                                    contest.match.date,
                                    contest.match.startTime,
                                );
                                const formattedDate = contest.match.date
                                    .split('-')
                                    .reverse()
                                    .join('-');
                                return (
                                    <p className="text-center text-xs text-red-500 font-bold">
                                        {timeLeft === "tomorrow" ? (
                                            <>
                                                {"Tomorrow"}
                                                <br />
                                            </>
                                        ) : timeLeft ? (
                                            <div className="mb-1 flex px-2 py-1 rounded-md items-center text-center justify-center">
                                                <img src={clock} alt="" className='h-3 w-3 mr-1' />
                                                <span className="font-bold">
                                                    {timeLeft}
                                                </span>
                                            </div>
                                        ) : (
                                            <>
                                                {formattedDate}
                                                <br />
                                            </>
                                        )}
                                        <span className="text-slate-500 font-normal">
                                            {convertIn12Hours(contest.match.startTime)}
                                        </span>
                                    </p>
                                );
                            })()}

                            <div className="flex items-center space-x-2">
                                <p className="text-center font-bold text-stone-500">
                                    {contest.match.teamAAcronym}
                                </p>
                                {contest.match.teamAImg && (
                                    <img
                                        src={contest.match.teamAImg}
                                        alt="Team A"
                                        className="h-9 object-contain"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-1 px-4">
                            <p className="mt-4 flex items-center text-fuchsia-900">
                                Prize Pool:{'    '}
                                <img src={increase} alt="" className='h-5 w-5 mr-1 ml-1' />
                                <span className="font-semibold text-xl ">
                                    ₹{contest.prizePool}
                                </span>
                            </p>
                            <p className="text-white mt-4 bg-green-600 px-3 py-1 rounded-md">
                                Entry:{' '}
                                <span className="font-medium">
                                    ₹{contest.entryFee}
                                </span>
                            </p>
                        </div>
                        <div className="flex justify-between items-center px-4 mb-3 text-fuchsia-900">
                            <p className=" mt-2">
                                Spots:{' '}
                                <span className="font-semibold ">
                                    {contest.maxParticipants}
                                </span>
                            </p>

                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ContestsInMatches;
