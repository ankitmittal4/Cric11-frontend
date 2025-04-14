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
            // console.log("response.data: ", response.data.data);
            setMatches(response.data.data);
        };
        fetchMatches();
    }, []);
    // console.log('###: ', contests);
    const date = new Date();
    const istDate = toZonedTime(date, 'Asia/Kolkata');
    const istCurrentTimeStamp = istDate.getTime();

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
                    .map((match) => (
                        <Link
                            to={`/match/${match._id}`}
                            key={match._id}
                            className="mb-2 p-4 rounded-lg shadow-md border-2 border-gray-400 bg-gray-100 hover:bg-gray-200"
                        >
                            <h2 className="text-xl font-bold text-center text-gray-600 mb-1 min-h-14">
                                {match.name}
                            </h2>
                            <div className="flex justify-between mt-4 mb-1">
                                {match.teamBImg ? (
                                    <img
                                        src={match.teamBImg}
                                        alt="A"
                                        className="your-css-class h-9"
                                    />
                                ) : (
                                    <p></p>
                                )}
                                <p className="text-center  text-xs text-red-500 font-bold">
                                    {match.date.split('-').reverse().join('-')}
                                    <br></br>
                                    {match.startTime}
                                </p>
                                {match.teamAImg ? (
                                    <img
                                        src={match.teamAImg}
                                        alt="B"
                                        className="your-css-class h-9"
                                    />
                                ) : (
                                    <p></p>
                                )}
                            </div>
                            {/* <div className="flex justify-between">
                                <p className="text-black mt-4">
                                    Prize Pool:{' '}
                                    <span className="font-semibold text-xl">
                                        ₹{contest.prizePool}
                                    </span>
                                </p>
                                <p className="text-white mt-4 bg-green-600 px-3 py-1 rounded-md">
                                    Entry:{' '}
                                    <span className="font-medium">
                                        ₹{contest.entryFee}
                                    </span>
                                </p>
                            </div> */}
                        </Link>
                    ))}
            </div>
        </div>
    );
};

export default Home;
