import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import ground from '../assets/ground.jpg';
import Popup from '../features/Popup';
import { useMemo } from 'react';
import warning from '../assets/warning.png';
import { API_URL } from '../../Constants';

const ContestDetails = () => {
    const { id } = useParams(); // Get the contest ID from the URL

    const navigate = useNavigate();
    const [contest, setContest] = useState(null);
    const [players, setPlayers] = useState([]); // Assuming you want to select players

    const [error, setError] = useState('');

    const [selectedPlayerIds, setSelectedPlayerIds] = useState([]);
    const [captainId, setCaptainId] = useState(null);
    const [viceCaptainId, setViceCaptainId] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');

    const [teamACount, setTeamACount] = useState(0);
    const [teamBCount, setTeamBCount] = useState(0);

    const teamPlayerCount = useMemo(() => {
        const count = {};

        const teams = Array.from(new Set(players.map(p => p.team)));

        teams.forEach(team => {
            count[team] = 0;
        });

        selectedPlayerIds.forEach((id) => {
            const player = players.find((p) => p.id === id);
            if (player && Object.prototype.hasOwnProperty.call(count, player.team)) {
                count[player.team]++;
            }
        });

        return count;
    }, [selectedPlayerIds, players]);


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

    const rolePriority = {
        'WK-Batsman': 1,
        Batsman: 2,
        'Batting Allrounder': 3,
        'Bowling Allrounder': 4,
        Bowler: 5,
        '--': 6,
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

        const sorted = [...selectedPlayerIds].sort((a, b) => {
            const playerA = players.find(p => p.id === a);
            const playerB = players.find(p => p.id === b);

            const roleA = playerA?.role || '--';
            const roleB = playerB?.role || '--';

            const priorityA = rolePriority[roleA];
            const priorityB = rolePriority[roleB];

            if (priorityA !== priorityB) {
                return priorityA - priorityB;
            }

            // Same role, fall back to their order in the full players list
            return players.findIndex(p => p.id === a) - players.findIndex(p => p.id === b);
        });

        setSelectedPlayerIds(sorted);

        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const closeErrorPopup = () => {
        setError('');
    };
    const handleJoinContest = async () => {
        const accessToken = localStorage.getItem('accessToken');



        // console.log("accessToken: ", accessToken);
        const contestData = {
            contestId: id,
            players: selectedPlayerIds,
            captain: captainId,
            viceCaptain: viceCaptainId,
        };

        try {
            // console.log("user contest id: ", response.data.data._id);
            const response = await axios.post(
                `${API_URL}/user-contest/create`,
                contestData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                },
            );
            if (response.data.statusCode === 200) {
                // navigate('/my-contests');
                // alert('Contest Joined successfully!');
                setPopupMessage('Contest Joined Successfully!');
                setIsPopupVisible(true);
            }

            const opponentData = {
                userContestId: response.data.data._id,
                contestId: id,
            };
            const res = await axios.post(
                `${API_URL}/opponent/create`,
                opponentData,
            );
            console.log('Create opponent res: ', res);
        } catch (error) {
            alert(
                error.response?.data?.message ||
                'Failed! Contest Not Joined...',
            );

            console.log(
                error.response?.data?.message || 'Failed to create contest',
            );
        }
    };
    const closePopup = () => {
        setIsPopupVisible(false); // Hide the popup
        navigate('/my-contests');
    };

    useEffect(() => {
        const fetchContestDetails = async () => {
            const response = await axios.post(`${API_URL}/contests/get`, {
                id,
            });
            // console.log("Response: ", response.data.data);
            setContest(response.data.data);

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
            const combinedSquad = updatedPlayersResponse1.concat(
                updatedPlayersResponse2,
            );
            setPlayers(combinedSquad);
            // console.log('Players: ', players);
        };
        fetchContestDetails();
    }, [id]);


    const sortedPlayers = players.sort((a, b) => {
        return rolePriority[a.role] - rolePriority[b.role];
    });
    // const sortedSelectedPlayers = [...selectedPlayerIds].sort((a, b) => {
    //     const roleA = players.find((p) => p.id === a)?.role || '--';
    //     const roleB = players.find((p) => p.id === b)?.role || '--';
    //     return rolePriority[roleA] - rolePriority[roleB];
    // });

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
            <h1 className="text-2xl font-bold mb-6 text-gray-600 text-center">
                {contest.matchDetails.name}
            </h1>
            {/* <p className="mb-4 text-gray-700">{contest.description}</p> */}
            <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 p-4 text-xl">
                    <h2 className="text-2xl font-bold">Contest Details:</h2>
                    <p className="text-black mt-4">
                        Match Type:{' '}
                        <span className="font-semibold uppercase text-blue-600">
                            {contest.matchDetails.matchType}
                        </span>
                    </p>
                    <p className="text-black mt-4">
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
                            ₹{contest.prizePool}
                        </span>
                    </p>
                    <p className="text-black mt-4">
                        Entry:{' '}
                        <span className="font-semibold text-green-600">
                            ₹{contest.entryFee}
                        </span>
                    </p>
                    <p className="text-black mt-4">
                        Spots:{' '}
                        <span className="font-semibold text-red-600">
                            {contest.maxParticipants}
                        </span>
                    </p>
                </div>

                <div className="md:w-[90%]">
                    <div className='flex '>
                        {Object.entries(teamPlayerCount).map(([teamName, count]) => (
                            <div key={teamName} className="bg-slate-100 px-4 py-2 rounded-xl shadow-sm">
                                {teamName}: {count} players
                            </div>
                        ))}

                        <h2 className="text-xl font-bold text-center mb-7">
                            Selected Players: {selectedPlayerIds.length} / 11
                        </h2>

                    </div>
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
                                    {sortedPlayers.map((player) => (
                                        <tr
                                            key={player.id}
                                            className={`cursor-pointer  ${isPlayerSelected(player.id)
                                                ? 'bg-yellow-100'
                                                : 'hover:bg-fuchsia-100'
                                                }`}
                                            onClick={() =>
                                                handlePlayerSelection(player.id)
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
                                                        captainId === player.id
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
                                                        captainId === player.id
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
                            Submit Team
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
                                    {selectedPlayerIds.slice(0, 2).map((id) => {
                                        const player = players.find(
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
                                                    />{' '}
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
                                        className="grid grid-cols-3 gap-16 mt-12 "
                                    >
                                        {selectedPlayerIds
                                            .slice(startIdx, startIdx + 3)
                                            .map((id) => {
                                                const player = players.find(
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
                                                                    <span className="flex items-center justify-center w-6 h-6 absolute -top-3 left-6 text-sm text-white font-medium bg-gray-500 p-1 rounded-full">
                                                                        C
                                                                    </span>
                                                                )}
                                                            {viceCaptainId ===
                                                                player.id && (
                                                                    <span className="flex items-center justify-center w-6 h-6 absolute -top-3 left-6 text-xs text-white font-medium bg-gray-500 p-1 rounded-full">
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
                                                    </div>
                                                );
                                            })}
                                    </div>
                                ))}

                                <hr className="mt-10" />
                                <div className="flex mt-5">
                                    <button
                                        className="bg-green-800 text-white px-4 py-2 rounded mt-4 mx-auto block hover:bg-green-700"
                                        onClick={handleJoinContest}
                                    >
                                        Join Contest
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
export default ContestDetails;

{
    /* <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                                <div className="bg-white p-6 pl-9 pr-9 rounded-lg shadow-lg">
                                    <h2 className="text-xl font-bold mb-5">
                                        Error
                                    </h2>
                                    <p>{error}</p>
                                    <button
                                        onClick={closeErrorPopup}
                                        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div> */
}
