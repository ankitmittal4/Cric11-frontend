import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from '../../Constants';

const UserContestDetails = () => {
    const { id } = useParams();
    const [contest, setContest] = useState(null);
    const [players, setPlayers] = useState([]);

    const [opponentContest, setOpponentContest] = useState(null);
    const [opponentPlayers, setOpponentPlayers] = useState([]);

    const hasFetchded = useRef(false);
    useEffect(() => {
        if (!hasFetchded.current) {
            hasFetchded.current = true;

            const fetchContestDetails = async () => {
                const accessToken = localStorage.getItem('accessToken');
                const response = await axios.post(
                    `${API_URL}/user-contest/get`,
                    {
                        id,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    },
                );
                // console.log('User Response: ', response.data.data);
                setContest(response.data.data[0]);
                setPlayers(response.data.data[0].user11);
                const { userId, contestId } = response.data.data[0];
                const matchDateAndTime = new Date(
                    `${response.data.data[0].matchDetails.date}T${response.data.data[0].matchDetails.startTime}`,
                );
                const curTime = new Date();

                if (matchDateAndTime <= curTime) {
                    // console.log('Match Started or ended');
                    try {
                        const res = await axios.post(
                            `${API_URL}/opponent/get`,
                            {
                                contestId: contestId,
                                userContestId: id,
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${accessToken}`,
                                },
                            },
                        );
                        const opponentUserContestId = res.data.data.opponent;
                        // console.log(opponentUserContestId);
                        //NOTE: get opponent details
                        if (opponentUserContestId) {
                            try {
                                //NOTE: Find points and result of both user and opponent
                                const userRes = await axios.post(
                                    `${API_URL}/user-contest/update`,
                                    {
                                        id,
                                        opponentId: opponentUserContestId,
                                    },
                                    {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`,
                                        },
                                    },
                                );
                                console.log(
                                    'user points: ',
                                    userRes.data.data.updatedUserContest[0]
                                        .points,
                                );
                                console.log(
                                    'opponent points: ',
                                    userRes.data.data.updatedOpponentContest[0]
                                        .points,
                                );
                                setContest(
                                    userRes.data.data.updatedUserContest[0],
                                );
                                setPlayers(
                                    userRes.data.data.updatedUserContest[0]
                                        .user11,
                                );
                                setOpponentContest(
                                    userRes.data.data.updatedOpponentContest[0],
                                );
                                setOpponentPlayers(
                                    userRes.data.data.updatedOpponentContest[0]
                                        .user11,
                                );
                            } catch {
                                console.log('Error: Opponent data not found');
                            }
                        }
                    } catch {
                        console.log('Error: Opponent not found');
                    }
                }

                // setContest(response.data.data[0]);
                // setPlayers(response.data.data[0].user11);
            };

            fetchContestDetails();
        }
    }, [id]);

    const handleUpdateTeam = () => {};
    // console.log('user Contests: ', contest);
    // console.log('Opponent Contests: ', opponentContest);
    if (!contest) return <p>Loading...</p>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-10 text-gray-600 text-center">
                {contest.matchDetails.name}
            </h1>
            {/* <p className="mb-4 text-gray-700">{contest.description}</p> */}
            <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 p-4">
                    <h2 className="text-2xl font-bold">Contest Details:</h2>
                    <p className="text-black mt-4">
                        Match Type:{' '}
                        <span className="font-semibold uppercase text-blue-600">
                            {contest.matchDetails.matchType}
                        </span>
                    </p>
                    <p className="text-black mt-4">
                        Date:{' '}
                        <span className="font-semibold text-orange-600">
                            {contest.matchDetails.date
                                .split('-')
                                .reverse()
                                .join('-')}
                        </span>
                    </p>
                    <p className="text-black mt-4">
                        Start Time(IST):{' '}
                        <span className="font-semibold text-orange-600">
                            {contest.matchDetails.startTime}
                        </span>
                    </p>
                    <p className="text-black mt-4">
                        Prize Pool:{' '}
                        <span className="font-semibold text-red-600">
                            ₹{contest.contestDetails.prizePool}
                        </span>
                    </p>
                    <p className="text-black mt-4">
                        Entry:{' '}
                        <span className="font-semibold text-green-600">
                            ₹{contest.contestDetails.entryFee}
                        </span>
                    </p>
                    <p className="text-black mt-4">
                        Spots:{' '}
                        <span className="font-semibold text-red-600">
                            {contest.contestDetails.maxParticipants}
                        </span>
                    </p>
                    <p className="text-black mt-4  text-xl">
                        Rank:{' '}
                        <span className="font-semibold text-blue-700">
                            {contest.result}
                        </span>
                    </p>
                </div>
                <div className="md:w-1/2">
                    <h2 className="text-xl font-bold text-center mb-1 text-green-500">
                        Total Points:{' '}
                        <span className="text-3xl text-green-600">
                            {contest.points}
                        </span>
                    </h2>
                    <div className="  bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-green-500 p-6 rounded-lg w-full max-w-lg">
                            <div className="flex justify-center gap-24 mt-8 mb-7">
                                {players.slice(0, 2).map((player) => {
                                    return (
                                        <div
                                            key={player.id}
                                            className="text-center"
                                        >
                                            <FontAwesomeIcon
                                                icon={faUser}
                                                className="text-green-800 text-3xl"
                                            />{' '}
                                            {player.id === contest.captain && (
                                                <span className="text-sm text-black font-semibold">
                                                    (C)
                                                </span>
                                            )}
                                            {player.id ===
                                                contest.viceCaptain && (
                                                <span className="text-sm font-semibold text-black">
                                                    (VC)
                                                </span>
                                            )}
                                            <span className="block text-white px-6 rounded-sm py-px bg-red-600 text-sm">
                                                {player.name}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {[2, 5, 8].map((startIdx, index) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-3 gap-20 mt-16 "
                                >
                                    {players
                                        .slice(startIdx, startIdx + 3)
                                        .map((player) => {
                                            return (
                                                <div
                                                    key={player.id}
                                                    className="text-center"
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faUser}
                                                        className="text-green-800 text-3xl"
                                                    />{' '}
                                                    {player.id ===
                                                        contest.captain && (
                                                        <span className="text-sm text-black font-semibold">
                                                            (C)
                                                        </span>
                                                    )}
                                                    {player.id ===
                                                        contest.viceCaptain && (
                                                        <span className="text-sm font-semibold text-black">
                                                            (VC)
                                                        </span>
                                                    )}
                                                    <span className="block text-white rounded-sm py-px bg-red-600 text-sm">
                                                        {player.name}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <button
                            onClick={handleUpdateTeam}
                            className=" bg-green-600 hover:bg-green-500 text-white rounded-md p-2 mt-2 "
                        >
                            Update Team
                        </button>
                    </div>
                </div>

                {opponentPlayers.length != 0 && (
                    <div className="md:w-1/2 ml-5">
                        <h2 className="text-xl font-bold text-center mb-1 text-green-500">
                            Total Opponent Points:{' '}
                            <span className="text-3xl text-green-600">
                                {opponentContest.points}
                            </span>
                        </h2>
                        <div className="  bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-green-500 p-6 rounded-lg w-full max-w-lg">
                                <div className="flex justify-center gap-24 mt-8 mb-7">
                                    {opponentPlayers
                                        .slice(0, 2)
                                        .map((player) => {
                                            return (
                                                <div
                                                    key={player.id}
                                                    className="text-center"
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faUser}
                                                        className="text-green-800 text-3xl"
                                                    />{' '}
                                                    {player.id ===
                                                        opponentContest.captain && (
                                                        <span className="text-sm text-black font-semibold">
                                                            (C)
                                                        </span>
                                                    )}
                                                    {player.id ===
                                                        opponentContest.viceCaptain && (
                                                        <span className="text-sm font-semibold text-black">
                                                            (VC)
                                                        </span>
                                                    )}
                                                    <span className="block text-white px-6 rounded-sm py-px bg-red-600 text-sm">
                                                        {player.name}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                </div>

                                {[2, 5, 8].map((startIdx, index) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-3 gap-20 mt-16 "
                                    >
                                        {opponentPlayers
                                            .slice(startIdx, startIdx + 3)
                                            .map((player) => {
                                                return (
                                                    <div
                                                        key={player.id}
                                                        className="text-center"
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faUser}
                                                            className="text-green-800 text-3xl"
                                                        />{' '}
                                                        {player.id ===
                                                            opponentContest.captain && (
                                                            <span className="text-sm text-black font-semibold">
                                                                (C)
                                                            </span>
                                                        )}
                                                        {player.id ===
                                                            opponentContest.viceCaptain && (
                                                            <span className="text-sm font-semibold text-black">
                                                                (VC)
                                                            </span>
                                                        )}
                                                        <span className="block text-white rounded-sm py-px bg-red-600 text-sm">
                                                            {player.name}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                ))}
                                <div className="mt-10"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default UserContestDetails;
