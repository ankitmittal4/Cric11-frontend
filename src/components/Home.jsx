import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { API_URL } from '../../Constants';
import { format, toZonedTime } from 'date-fns-tz';

const Home = () => {
    const navigate = useNavigate();

    const [matches, setMatches] = useState([]);

    useEffect(() => {
        if (!localStorage.getItem('accessToken')) {
            navigate('/signin');
        }

        const fetchMatches = async () => {
            const response = await axios.get(`${API_URL}/match/all`);
            // console.log('response.data: ', response.data.data);
            setMatches(response.data.data);
        };
        fetchMatches();
    }, []);
    // console.log('###: ', contests);
    const date = new Date();
    const istDate = toZonedTime(date, 'Asia/Kolkata');
    const istCurrentTimeStamp = istDate.getTime();
    const getTimeLeft = (matchDate, matchTime) => {
        const matchStart = new Date(`${matchDate}T${matchTime}:00`);
        const now = new Date();

        const diffMs = matchStart - now;
        // console.log('Diffms', diffMs);
        if (diffMs > 24 * 60 * 60 * 1000) return null;

        const diffSec = Math.floor(diffMs / 1000);
        const hours = Math.floor(diffSec / 3600);
        const minutes = Math.floor((diffSec % 3600) / 60);

        return `${hours}h ${minutes}m`;
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6 text-gray-600">
                Upcoming Cricket Matches
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {matches
                    .filter((match) => {
                        {
                            const date2 = new Date(
                                `${match.date}T${match.startTime}`,
                            );

                            const istDate = toZonedTime(date2, 'Asia/Kolkata');

                            const istMatchTimeStamp = istDate.getTime();

                            return istCurrentTimeStamp < istMatchTimeStamp;
                        }
                    })
                    .sort((a, b) => {
                        const dateA = new Date(`${a.date}T${a.startTime}`);
                        const dateB = new Date(`${b.date}T${b.startTime}`);
                        return dateA - dateB;
                    })
                    .map((match) => (
                        <Link
                            to={`/match/${match._id}`}
                            key={match._id}
                            className="mb-2 rounded-lg shadow-md border-2 border-gray-400 bg-gray-100 hover:bg-gray-200 overflow-hidden"
                        >
                            <div
                                className="bg-slate-300 inline-block text-gray-700 text-sm font-semibold px-3 py-1 pr-10 mb-2 "
                                style={{
                                    clipPath:
                                        'polygon(0 0, calc(100% - 20px) 0, 100% 35px, 100% 100%, 0% 100%)',
                                }}
                            >
                                {match?.series}
                            </div>

                            <div className="flex items-center justify-between w-full px-4 mt-2 min-h-16">
                                <h2 className="text-xl font-bold text-gray-600 mb-1  text-center">
                                    {match.teamB}
                                </h2>
                                <span className="text-red-400 text-lg font-semibold">
                                    vs
                                </span>
                                <h2 className="text-xl font-bold text-gray-600 mb-1  text-center">
                                    {match.teamA}
                                </h2>
                            </div>

                            <div className="flex justify-between items-center mt-4 mb-6 px-4">
                                <div className="flex items-center space-x-2">
                                    {match.teamBImg && (
                                        <img
                                            src={match.teamBImg}
                                            alt="Team B"
                                            className="h-9 object-contain"
                                        />
                                    )}

                                    <p className="text-center font-bold text-stone-500">
                                        {match.teamBAcronym}
                                    </p>
                                </div>

                                {(() => {
                                    const timeLeft = getTimeLeft(
                                        match.date,
                                        match.startTime,
                                    );
                                    const formattedDate = match.date
                                        .split('-')
                                        .reverse()
                                        .join('-');
                                    return (
                                        <p className="text-center text-xs text-red-500 font-bold">
                                            {timeLeft ? (
                                                <div className="mb-1">
                                                    <span className="font-extrabold bg-red-100 px-2 py-1 rounded-md mb-10">
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
                                                {match.startTime}
                                            </span>
                                        </p>
                                    );
                                })()}

                                <div className="flex items-center space-x-2">
                                    <p className="text-center font-bold text-stone-500">
                                        {match.teamAAcronym}
                                    </p>
                                    {match.teamAImg && (
                                        <img
                                            src={match.teamAImg}
                                            alt="Team A"
                                            className="h-9 object-contain"
                                        />
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
            </div>
        </div>
    );
};

export default Home;
