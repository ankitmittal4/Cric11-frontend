import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { format, toZonedTime } from 'date-fns-tz';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMatches } from '../../features/slice/appSlice';
import clock from "../../assets/clock.png";

const Home = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { matches, loading, error } = useSelector((state) => state.app);

    useEffect(() => {
        if (!localStorage.getItem('accessToken')) {
            navigate('/signin');
            return;
        }

        // Fetch matches data
        dispatch(fetchMatches());
        // console.log(matches);
    }, [dispatch, navigate]);

    // console.log('###: ', contests);
    const date = new Date();
    const istDate = toZonedTime(date, 'Asia/Kolkata');
    const istCurrentTimeStamp = istDate.getTime();

    const getTimeLeft = (matchDate, matchTime) => {
        const matchStart = new Date(`${matchDate}T${matchTime}:00`);
        const now = new Date();

        // const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(now.getDate() + 1);
        if (matchStart.getDate() === tomorrow.getDate() &&
            matchStart.getMonth() === tomorrow.getMonth() &&
            matchStart.getFullYear() === tomorrow.getFullYear()) {
            // console.log("tomorrow");
            return "tomorrow"
        }

        const diffMs = matchStart - now;
        // console.log('Diffms', diffMs);
        if (diffMs > 24 * 60 * 60 * 1000) return null;

        const diffSec = Math.floor(diffMs / 1000);
        const hours = Math.floor(diffSec / 3600);
        const minutes = Math.floor((diffSec % 3600) / 60);
        const seconds = diffSec % 60;

        return `${hours > 0 ? `${hours}h` : ''} ${minutes}m`;
    };

    const convertIn12Hours = (time) => {
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours);

        const period = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${hours}:${minutes} ${period}`;
    }

    if (loading) {
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-xl sm:text-2xl font-bold mb-6 text-gray-600 sm:text-left text-center">
                    Upcoming Cricket Matches
                </h1>
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
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <div className="text-center text-red-600">
                    <h2 className="text-xl font-bold mb-4">Error Loading Matches</h2>
                    <p>{error}</p>
                    <button
                        onClick={() => dispatch(fetchMatches())}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl sm:text-2xl font-bold mb-6 text-gray-600 sm:text-left text-center">
                Upcoming Cricket Matches
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {matches
                    ?.filter((match) => {
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
                            className="mb-2 rounded-lg shadow-md border-2 border-gray-400 bg-gray-100 hover:bg-slate-200 overflow-hidden"
                        >
                            <div
                                className="bg-slate-300 inline-block text-gray-700 sm:text-sm text-xs font-semibold px-3 py-1 sm:pt-1 pt-[.35rem] pr-10 mb-2"
                                style={{
                                    clipPath:
                                        'polygon(0 0, calc(100% - 20px) 0, 100% 35px, 100% 100%, 0% 100%)',
                                }}
                            >
                                {match?.series}
                            </div>

                            <div className="flex justify-between  w-full px-3 min-h-16 items-center">
                                <div className="w-1/2 flex justify-start">
                                    <h2 className="text-lg sm:text-xl font-bold text-gray-600 text-center">
                                        {match.teamB}
                                    </h2>
                                </div>
                                <span className='mx-1'></span>
                                <div className="w-1/2 flex justify-end">
                                    <h2 className="text-lg sm:text-xl font-bold text-gray-600 text-center">
                                        {match.teamA}
                                    </h2>
                                </div>
                            </div>


                            <div className="flex justify-between items-center mt-4 mb-6 px-4">
                                <div className="flex items-center space-x-2">
                                    {match.teamBImg && (
                                        <img
                                            src={match.teamBImg}
                                            alt="Team B"
                                            className="h-9 object-contain rounded-sm"
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
                                        <div className="text-center text-xs text-red-500 font-bold">
                                            {timeLeft === "tomorrow" ? (
                                                <>
                                                    {"Tomorrow"}
                                                    <br />
                                                </>
                                            ) : timeLeft ? (
                                                <div className="mb-1 flex bg-red-100 px-2 py-1 rounded-md items-center">
                                                    <img loading="lazy" src={clock} alt="" className='h-3 w-3 mr-1' />
                                                    <span className="font-extrabold ">
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
                                                {convertIn12Hours(match.startTime)}
                                            </span>
                                        </div>
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
                                            className="h-9 object-contain rounded-sm"
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
