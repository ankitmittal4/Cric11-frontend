import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../Constants';
import ground from '../assets/ground.jpg';
import Popup from '../features/Popup';
import warning from '../assets/warning.png';

import Confetti from 'react-confetti';

const UserContestDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [contest, setContest] = useState(null);
    const [players, setPlayers] = useState([]);

    const [isWinner, setIsWinner] = useState(false);

    const [opponentContest, setOpponentContest] = useState(null);
    const [opponentPlayers, setOpponentPlayers] = useState([]);

    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');

    //Update team before start useStates
    const [playersSelection, setPlayersSelection] = useState([]);
    const [error, setError] = useState('');
    const [selectedPlayerIds, setSelectedPlayerIds] = useState([]);
    const [captainId, setCaptainId] = useState(null);
    const [viceCaptainId, setViceCaptainId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMatchStarted, setIsMatchStarted] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);

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
                // console.log('User Response: ', response.data.data[0]);
                if (response.data.data[0].result === 'win') {
                    setIsWinner(true);
                }
                setContest(response.data.data[0]);
                setPlayers(response.data.data[0].user11);
                const { userId, contestId } = response.data.data[0];
                const matchDateAndTime = new Date(
                    `${response.data.data[0].matchDetails.date}T${response.data.data[0].matchDetails.startTime}`,
                );
                const curTime = new Date();
                setIsMatchStarted(matchDateAndTime <= curTime);
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
                                // console.log(
                                //     'user points: ',
                                //     userRes.data.data.updatedUserContest[0]
                                //         .points,
                                // );
                                // console.log(
                                //     'opponent points: ',
                                //     userRes.data.data.updatedOpponentContest[0]
                                //         .points,
                                // );
                                // console.log(
                                //     userRes.data.data.updatedUserContest[0],
                                // );

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

    //NOTE: Code for team update if match not started
    const handleUpdateTeam = async () => {
        setIsUpdate(true);
        setIsModalOpen(false);
        const id = contest.contestId;
        const response = await axios.post(`${API_URL}/contests/get`, { id });

        // setContest(response.data.data);

        // Fetch (squad)players for team selection
        const playersResponse1 =
            response.data.data.squadDetails.squad[0].players;

        const updatedPlayersResponse1 = playersResponse1.map((player) => ({
            ...player,
            team: response.data.data.squadDetails.squad[0].teamName,
        }));
        const playersResponse2 =
            response.data.data.squadDetails.squad[1].players;
        const updatedPlayersResponse2 = playersResponse2.map((player) => ({
            ...player,
            team: response.data.data.squadDetails.squad[1].teamName,
        }));
        // console.log("combinedSquad: ", playersResponse1);
        const combinedSquad = updatedPlayersResponse1.concat(
            updatedPlayersResponse2,
        );
        setPlayersSelection(combinedSquad);
        const my11 = contest.user11.map((player) => player.id);
        setSelectedPlayerIds(my11);
        setViceCaptainId(contest.captain);
        setCaptainId(contest.viceCaptain);
    };
    const handlePlayerSelection = (playerId) => {
        setSelectedPlayerIds((prev) => {
            const isSelected = prev.includes(playerId);
            if (isSelected) {
                return prev.filter((id) => id !== playerId);
            } else if (prev.length < 11) {
                return [...prev, playerId];
            } else if (prev.length >= 11) {
                setError('You can only select up to 11 players');
            }
            return prev;
        });
    };

    const handleCaptainChange = (playerId) => {
        setCaptainId(playerId);
        if (!selectedPlayerIds.includes(playerId)) {
            handlePlayerSelection(playerId);
        }
    };

    const handleViceCaptainChange = (playerId) => {
        setViceCaptainId(playerId);
        if (!selectedPlayerIds.includes(playerId)) {
            handlePlayerSelection(playerId);
        }
    };

    const isPlayerSelected = (playerId) => selectedPlayerIds.includes(playerId);

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const closeErrorPopup = () => {
        setError('');
    };
    const handleUpdateContest = async () => {
        const accessToken = localStorage.getItem('accessToken');
        // const id = contest.contestId;
        // console.log("accessToken: ", accessToken);
        const contestData = {
            id,
            players: selectedPlayerIds,
            captain: captainId,
            viceCaptain: viceCaptainId,
        };

        try {
            // console.log("user contest id: ", response.data.data._id);
            const response = await axios.post(
                `${API_URL}/user-contest/update-team`,
                contestData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                },
            );
            console.log(
                'Response of update team: ',
                response.data.data[0].matchDetails,
            );
            setContest(response.data.data[0]);
            setPlayers(response.data.data[0].user11);

            if (response.data.statusCode === 200) {
                // alert('Contest Updated successfully!');
                setPopupMessage('Contest Updated Successfully!');
                setIsPopupVisible(true);
                setIsUpdate(false);
            }
        } catch (error) {
            alert('Failed! Contest Not Updated...');

            console.log(
                error.response?.data?.message || 'Failed to update contest',
            );
        }
    };
    const closePopup = () => {
        setIsPopupVisible(false); // Hide the popup
    };

    //TODO: Validation on submit
    const handleSubmitTeam = (e) => {
        e.preventDefault();
        //validation for captain and vc present
        if (selectedPlayerIds.length < 11) {
            setError('Select exactly 11 players');
            return;
        }
        if (!captainId || !selectedPlayerIds.includes(captainId)) {
            setError('Captain is mandatory');
            return;
        }
        if (!viceCaptainId || !selectedPlayerIds.includes(viceCaptainId)) {
            setError('Vice-Captain is mandatory');
            return;
        }
        setIsModalOpen(true);
    };

    // console.log('user Contests: ', contest);
    // console.log('Opponent Contests: ', opponentContest);
    const rolePriority = {
        'WK-Batsman': 1,
        Batsman: 2,
        'Batting Allrounder': 3,
        'Bowling Allrounder': 4,
        Bowler: 5,
        '--': 6,
    };

    const sortedPlayers = playersSelection.sort((a, b) => {
        return rolePriority[a.role] - rolePriority[b.role];
    });
    const sortedUserPlayers = players.sort((a, b) => {
        return rolePriority[a.role] - rolePriority[b.role];
    });
    const sortedOpponentPlayers = opponentPlayers.sort((a, b) => {
        return rolePriority[a.role] - rolePriority[b.role];
    });

    const checkTextWidth = (text) => {
        const span = document.createElement('span');
        span.style.visibility = 'hidden';
        span.style.whiteSpace = 'nowrap';
        span.style.position = 'absolute';
        span.innerText = text;
        document.body.appendChild(span);
        const width = span.offsetWidth;
        document.body.removeChild(span);
        return width;
    };

    const formatName = (name, maxWidth) => {
        const fullNameWidth = checkTextWidth(name);
        if (fullNameWidth <= maxWidth) {
            return name;
        }
        const nameParts = name.split(' ');
        if (nameParts.length >= 2) {
            const firstNameLetter = nameParts[0].charAt(0);
            const lastName = nameParts[nameParts.length - 1];
            return `${firstNameLetter} ${lastName}`;
        }
        return name;
    };

    if (!contest)
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="w-10 h-10 border-4 border-gray-300 border-t-white rounded-full animate-spin"></div>
            </div>
        );

    return (
        <div className="container mx-auto p-4">
            {isWinner && <Confetti />}
            <h1 className="text-2xl font-bold mb-10 text-gray-600 text-center">
                {contest.matchDetails.name}
            </h1>
            {/* <p className="mb-4 text-gray-700">{contest.description}</p> */}
            <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 p-4 ">
                    <h2 className="text-2xl font-bold">Contest Details:</h2>
                    <p className="text-black mt-4">
                        Match Type:{' '}
                        <span className="font-semibold uppercase text-blue-600">
                            {contest.matchDetails.matchType}
                        </span>
                    </p>
                    <p className="text-black mt-4 break-words">
                        Venue:{' '}
                        <span className="font-semibold  text-blue-600">
                            {contest.matchDetails.venue}
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
                            {contest?.result?.toUpperCase()}
                        </span>
                    </p>
                </div>

                {!isUpdate && (
                    <div className="md:w-[55%]">
                        <h2 className="text-xl font-bold text-center mb-1 text-green-500">
                            Total Points:{' '}
                            <span className="text-3xl text-green-600">
                                {contest.points}
                            </span>
                        </h2>
                        <div className="bg-opacity-50 flex items-center justify-center z-50">
                            <div
                                className={` bg-green-700 p-6 rounded-lg  max-w-lg mx-4 my-4 bg-cover bg-center  ${
                                    opponentPlayers?.length === 0
                                        ? 'w-[65%]'
                                        : 'w-full'
                                } `}
                                style={{
                                    backgroundImage: `url(${ground})`,
                                    backgroundSize: '99% 96%',
                                }}
                            >
                                <div className="flex justify-center gap-24 mt-4 mb-14">
                                    {sortedUserPlayers
                                        .slice(0, 2)
                                        .map((player) => {
                                            return (
                                                <div
                                                    key={player.id}
                                                    className="text-center"
                                                >
                                                    <div className="relative">
                                                        {player.id ===
                                                            contest.captain && (
                                                            <span className="flex items-center justify-center w-6 h-6 absolute -top-3 left-2 text-sm text-white font-medium bg-gray-500 p-1 rounded-full">
                                                                C
                                                            </span>
                                                        )}
                                                        {player.id ===
                                                            contest.viceCaptain && (
                                                            <span
                                                                className={`flex items-center justify-center w-6 h-6 absolute -top-3 left-2 text-xs text-white font-medium bg-gray-500 p-1 rounded-full ${
                                                                    opponentPlayers?.length ===
                                                                        0 &&
                                                                    'left-0'
                                                                }`}
                                                            >
                                                                VC
                                                            </span>
                                                        )}
                                                        <FontAwesomeIcon
                                                            icon={faUser}
                                                            className="text-green-900 text-3xl"
                                                        />{' '}
                                                    </div>
                                                    <span className="block text-white rounded-sm py-px bg-red-600 text-sm w-20 whitespace-nowrap overflow-hidden text-ellipsis mx-auto px-1">
                                                        {formatName(
                                                            player.name,
                                                            85,
                                                        )}
                                                    </span>
                                                    <span className="block text-white rounded-sm py-px  text-xs w-20 whitespace-nowrap overflow-hidden text-ellipsis mx-auto px-1">
                                                        {player?.points} Pts
                                                    </span>
                                                </div>
                                            );
                                        })}
                                </div>

                                <div className="">
                                    {[2, 5, 8].map((startIdx, index) => (
                                        <div
                                            key={index}
                                            className="grid grid-cols-3 gap-14 mt-14 "
                                        >
                                            {sortedUserPlayers
                                                .slice(startIdx, startIdx + 3)
                                                .map((player) => {
                                                    return (
                                                        <div
                                                            key={player.id}
                                                            className="text-center"
                                                        >
                                                            <div className="relative">
                                                                {player.id ===
                                                                    contest.captain && (
                                                                    <span
                                                                        className={`flex items-center justify-center w-6 h-6 absolute -top-3  text-sm text-white font-medium bg-gray-500 p-1 rounded-full ${
                                                                            opponentPlayers.length
                                                                                ? 'left-1'
                                                                                : 'left-3'
                                                                        }`}
                                                                    >
                                                                        C
                                                                    </span>
                                                                )}
                                                                {player.id ===
                                                                    contest.viceCaptain && (
                                                                    <span
                                                                        className={`flex items-center justify-center w-6 h-6 absolute -top-3  text-xs text-white font-medium bg-gray-500 p-1 rounded-full ${
                                                                            opponentPlayers.length
                                                                                ? 'left-1'
                                                                                : 'left-3'
                                                                        }`}
                                                                    >
                                                                        VC
                                                                    </span>
                                                                )}
                                                                <FontAwesomeIcon
                                                                    icon={
                                                                        faUser
                                                                    }
                                                                    className="text-green-900 text-3xl"
                                                                />{' '}
                                                            </div>
                                                            <span className="block text-white rounded-sm py-px bg-red-600 text-sm w-20 whitespace-nowrap overflow-hidden text-ellipsis text-center mx-auto px-1">
                                                                {formatName(
                                                                    player.name,
                                                                    70,
                                                                )}
                                                            </span>
                                                            <span className="block text-white rounded-sm py-px  text-xs w-20 whitespace-nowrap overflow-hidden text-ellipsis mx-auto px-1">
                                                                {player?.points}{' '}
                                                                Pts
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {!isMatchStarted && (
                            <div className="flex justify-center">
                                <button
                                    onClick={handleUpdateTeam}
                                    className=" bg-green-600 hover:bg-green-500 text-white rounded-md p-2 mt-2 "
                                >
                                    Update Team
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {isUpdate && (
                    <div className="md:w-[90%]">
                        <h2 className="text-xl font-bold text-center mb-7">
                            Selected Players: {selectedPlayerIds.length} / 11
                        </h2>
                        <form
                            className=""
                            onSubmit={handleSubmitTeam}
                        >
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-300 rounded-3xl">
                                    <thead>
                                        <tr className="text-left border-b-2 bg-slate-200">
                                            <th className="py-2 text-md px-4 w-40">
                                                Role
                                            </th>
                                            <th className="py-2 text-md px-4 w-56">
                                                Player Name
                                            </th>
                                            <th className="px-4 ">Team</th>
                                            <th className="py-2 px-4">
                                                Captain (C)
                                            </th>
                                            <th className="py-2 px-4">
                                                Vice-Captain (VC)
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {playersSelection.map((player) => (
                                            <tr
                                                key={player.id}
                                                className={`cursor-pointer  ${
                                                    isPlayerSelected(player.id)
                                                        ? 'bg-yellow-100'
                                                        : 'hover:bg-fuchsia-100'
                                                }`}
                                                onClick={() =>
                                                    handlePlayerSelection(
                                                        player.id,
                                                    )
                                                }
                                            >
                                                <td className="py-2 px-4 border-b">
                                                    {player.role}
                                                </td>
                                                <td className="py-2 px-4 border-b">
                                                    {player.name}
                                                </td>
                                                <td className="py-2 px-4 border-b">
                                                    {player.team}
                                                </td>
                                                <td className="py-2 px-4 border-b text-center">
                                                    <input
                                                        type="radio"
                                                        name="captain"
                                                        value={player.id}
                                                        checked={
                                                            captainId ===
                                                            player.id
                                                        }
                                                        onClick={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                        onChange={() =>
                                                            handleCaptainChange(
                                                                player.id,
                                                            )
                                                        }
                                                        className="h-4 w-4"
                                                        disabled={
                                                            !isPlayerSelected(
                                                                player.id,
                                                            ) ||
                                                            viceCaptainId ===
                                                                player.id
                                                        }
                                                    />
                                                </td>
                                                <td className="py-2 px-4 border-b text-center">
                                                    <input
                                                        type="radio"
                                                        name="viceCaptain"
                                                        value={player.id}
                                                        checked={
                                                            viceCaptainId ===
                                                            player.id
                                                        }
                                                        onClick={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                        onChange={() =>
                                                            handleViceCaptainChange(
                                                                player.id,
                                                            )
                                                        }
                                                        className="h-4 w-4"
                                                        disabled={
                                                            !isPlayerSelected(
                                                                player.id,
                                                            ) ||
                                                            captainId ===
                                                                player.id
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {/* //Display error popup  */}
                            {error && (
                                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                                    <div className="bg-white p-6 rounded-lg shadow-lg text-center pl-9 pr-9 min-w-[23%]">
                                        <img
                                            className="h-12 w-12 text-center mx-auto"
                                            src={warning}
                                            alt="Check"
                                        ></img>
                                        <p className="text-lg text-gray-700 font-semibold mb-4 mt-6 ">
                                            {error}
                                        </p>
                                        <button
                                            onClick={closeErrorPopup}
                                            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="bg-green-600 text-white px-4 py-2 rounded mt-10 mb-11 mx-auto block hover:bg-green-700"
                            >
                                Update Team
                            </button>
                        </form>

                        {isModalOpen && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 overflow-y-auto">
                                <div
                                    className="relative bg-green-700 p-6 rounded-lg  max-w-lg mx-4 my-4 bg-cover bg-center w-full "
                                    style={{
                                        backgroundImage: `url(${ground})`,
                                        backgroundSize: '99% 96%',
                                    }}
                                >
                                    <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
                                        Team Preview
                                    </h2>

                                    <div className="flex justify-center gap-24 mt-8 mb-7">
                                        {selectedPlayerIds
                                            .slice(0, 2)
                                            .map((id) => {
                                                const player =
                                                    playersSelection.find(
                                                        (p) => p.id === id,
                                                    );
                                                return (
                                                    <div
                                                        key={player.id}
                                                        className="text-center"
                                                    >
                                                        <div className="relative">
                                                            {captainId ===
                                                                player.id && (
                                                                <span className="flex items-center justify-center w-6 h-6 absolute -top-3 left-2 text-sm text-white font-medium bg-gray-500 p-1 rounded-full">
                                                                    C
                                                                </span>
                                                            )}
                                                            {viceCaptainId ===
                                                                player.id && (
                                                                <span className="flex items-center justify-center w-6 h-6 absolute -top-3 left-2 text-xs text-white font-medium bg-gray-500 p-1 rounded-full">
                                                                    VC
                                                                </span>
                                                            )}
                                                            <FontAwesomeIcon
                                                                icon={faUser}
                                                                className="text-green-900 text-3xl"
                                                            />
                                                        </div>
                                                        <span className="block text-white rounded-sm py-px bg-red-600 text-sm w-20 whitespace-nowrap overflow-hidden text-ellipsis mx-auto px-1">
                                                            {formatName(
                                                                player.name,
                                                                85,
                                                            )}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                    </div>

                                    {[2, 5, 8].map((startIdx, index) => (
                                        <div
                                            key={index}
                                            className="grid grid-cols-3 gap-20 mt-12"
                                        >
                                            {selectedPlayerIds
                                                .slice(startIdx, startIdx + 3)
                                                .map((id) => {
                                                    const player =
                                                        playersSelection.find(
                                                            (p) => p.id === id,
                                                        );
                                                    return (
                                                        <div
                                                            key={player.id}
                                                            className="text-center"
                                                        >
                                                            <div className="relative">
                                                                {captainId ===
                                                                    player.id && (
                                                                    <span className="flex items-center justify-center w-6 h-6 absolute -top-3 left-4 text-sm text-white font-medium bg-gray-500 p-1 rounded-full">
                                                                        C
                                                                    </span>
                                                                )}
                                                                {viceCaptainId ===
                                                                    player.id && (
                                                                    <span className="flex items-center justify-center w-6 h-6 absolute -top-3 left-4 text-xs text-white font-medium bg-gray-500 p-1 rounded-full">
                                                                        VC
                                                                    </span>
                                                                )}
                                                                <FontAwesomeIcon
                                                                    icon={
                                                                        faUser
                                                                    }
                                                                    className="text-green-900 text-3xl"
                                                                />
                                                            </div>

                                                            <span className="block text-white rounded-sm py-px bg-red-600 text-sm w-20 whitespace-nowrap overflow-hidden text-ellipsis text-center mx-auto px-1">
                                                                {formatName(
                                                                    player.name,
                                                                    70,
                                                                )}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    ))}

                                    <hr className="mt-10" />
                                    <div className="flex mt-5">
                                        <button
                                            className="bg-green-800 text-white px-4 py-2 rounded mt-4 mx-auto block hover:bg-green-700"
                                            onClick={handleUpdateContest}
                                        >
                                            Update Contest
                                        </button>
                                        <button
                                            className="bg-red-700 text-white px-5 py-2 rounded mt-4 mx-auto block hover:bg-red-600"
                                            onClick={closeModal}
                                        >
                                            Back
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {opponentPlayers.length != 0 && (
                    <div className="md:w-[55%] ml-5 ">
                        <h2 className="text-xl font-bold text-center mb-1 text-green-500">
                            Total Opponent Points:{' '}
                            <span className="text-3xl text-green-600">
                                {opponentContest.points}
                            </span>
                        </h2>
                        <div className="  bg-opacity-50 flex items-center justify-center z-50">
                            <div
                                className="relative bg-green-700 p-6 rounded-lg  max-w-lg mx-4 my-4 bg-cover bg-center w-full "
                                style={{
                                    backgroundImage: `url(${ground})`,
                                    backgroundSize: '99% 96%',
                                }}
                            >
                                <div className="flex justify-center gap-24 mt-4 mb-14">
                                    {sortedOpponentPlayers
                                        .slice(0, 2)
                                        .map((player) => {
                                            return (
                                                <div
                                                    key={player.id}
                                                    className="text-center"
                                                >
                                                    <div className="relative">
                                                        {player.id ===
                                                            opponentContest.captain && (
                                                            <span className="flex items-center justify-center w-6 h-6 absolute -top-3 left-2 text-sm text-white font-medium bg-gray-500 p-1 rounded-full">
                                                                C
                                                            </span>
                                                        )}
                                                        {player.id ===
                                                            opponentContest.viceCaptain && (
                                                            <span className="flex items-center justify-center w-6 h-6 absolute -top-3 left-2 text-xs text-white font-medium bg-gray-500 p-1 rounded-full">
                                                                VC
                                                            </span>
                                                        )}
                                                        <FontAwesomeIcon
                                                            icon={faUser}
                                                            className="text-green-900 text-3xl"
                                                        />{' '}
                                                    </div>
                                                    <span className="block text-white rounded-sm py-px bg-red-600 text-sm w-20 whitespace-nowrap overflow-hidden text-ellipsis mx-auto px-1">
                                                        {formatName(
                                                            player.name,
                                                            85,
                                                        )}
                                                    </span>
                                                    <span className="block text-white rounded-sm py-px  text-xs w-20 whitespace-nowrap overflow-hidden text-ellipsis mx-auto px-1">
                                                        {player?.points} Pts
                                                    </span>
                                                </div>
                                            );
                                        })}
                                </div>

                                {[2, 5, 8].map((startIdx, index) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-3 gap-14 mt-14"
                                    >
                                        {sortedOpponentPlayers
                                            .slice(startIdx, startIdx + 3)
                                            .map((player) => {
                                                return (
                                                    <div
                                                        key={player.id}
                                                        className="text-center"
                                                    >
                                                        <div className="relative">
                                                            {player.id ===
                                                                opponentContest.captain && (
                                                                <span className="flex items-center justify-center w-6 h-6 absolute -top-3 left-1 text-sm text-white font-medium bg-gray-500 p-1 rounded-full">
                                                                    C
                                                                </span>
                                                            )}
                                                            {player.id ===
                                                                opponentContest.viceCaptain && (
                                                                <span className="flex items-center justify-center w-6 h-6 absolute -top-3 left-1 text-xs text-white font-medium bg-gray-500 p-1 rounded-full">
                                                                    VC
                                                                </span>
                                                            )}
                                                            <FontAwesomeIcon
                                                                icon={faUser}
                                                                className="text-green-900 text-3xl"
                                                            />
                                                        </div>

                                                        <span className="block text-white rounded-sm py-px bg-red-600 text-sm w-20 whitespace-nowrap overflow-hidden text-ellipsis text-center mx-auto px-1">
                                                            {formatName(
                                                                player.name,
                                                                70,
                                                            )}
                                                        </span>
                                                        <span className="block text-white rounded-sm py-px  text-xs w-20 whitespace-nowrap overflow-hidden text-ellipsis mx-auto px-1">
                                                            {player?.points} Pts
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {isPopupVisible && (
                <Popup
                    message={popupMessage}
                    onClose={closePopup}
                />
            )}
        </div>
    );
};
export default UserContestDetails;
