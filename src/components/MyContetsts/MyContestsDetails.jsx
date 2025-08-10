import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
const API_URL = import.meta.env.VITE_API_URL;
import ground from '../../assets/ground.jpg';
import Popup from '../../features/Popup';
import warning from '../../assets/warning.png';
import clock from '../../assets/clock.png';
import clock2 from '../../assets/clock2.png';

import Confetti from 'react-confetti';
import { set } from 'date-fns';

const UserContestDetails = () => {
    const accessToken = localStorage.getItem('accessToken');
    const { id } = useParams();
    const navigate = useNavigate();
    const [contest, setContest] = useState(null);
    const [players, setPlayers] = useState([]);
    const [userPoints, setUserPoints] = useState(0);

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

    const [matchDetail, setMatchDetail] = useState(null)

    const [activeTab, setActiveTab] = useState('WK');
    const scrollRef = useRef(null);

    const hasFetchded = useRef(false);

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const [confettiSize, setConfettiSize] = useState({
        width: 0,
        height: 0,
    });

    const updateConfettiSize = () => {
        setConfettiSize({
            width: window.innerWidth,
            height: Math.max(
                document.documentElement.scrollHeight,
                document.body.scrollHeight,
                document.documentElement.clientHeight,
            ),
        });
    };

    useEffect(() => {
        updateConfettiSize(); // Set on mount

        window.addEventListener('resize', updateConfettiSize);

        return () => window.removeEventListener('resize', updateConfettiSize);
    }, []);

    useEffect(() => {
        if (isWinner) {
            setTimeout(() => {
                updateConfettiSize();
            }, 10);
        }
    }, [isWinner]);

    useEffect(() => {
        if (isPopupOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isPopupOpen]);

    useEffect(() => {
        if (!hasFetchded.current) {
            hasFetchded.current = true;

            const fetchContestDetails = async () => {

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
                if (response.data.data[0].result === 'win') {
                    setIsWinner(true);
                    setTimeout(() => {
                        setIsWinner(false);
                    }, 10000);
                }

                setUserPoints(response.data.data[0]?.points);
                // console.log("---> ", response.data.data[0]);
                setContest(response.data.data[0]);
                // setContest(null);
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
                                // console.log("In opponent");
                                //NOTE: Find points and result of both user and opponent
                                // console.log("API calling");
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
                                // console.log("Contest details: ", userRes.data.data.updatedUserContest[0]);
                                setUserPoints(userRes.data.data.updatedUserContest[0]?.points);
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
                        alert("Sorry! Opponent not found. Your money will be refunded.");
                        try {
                            const response = await axios.post(
                                `${API_URL}/user-contest/delete`,
                                {
                                    id,
                                },
                                {
                                    headers: {
                                        Authorization: `Bearer ${accessToken}`,
                                    },
                                },
                            );

                        }
                        catch (error) {
                            console.log('Error: Failed to delete user contest');
                        }
                        navigate('/my-contests');
                        window.dispatchEvent(new CustomEvent('updateBalance'));
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
    const [playersLoading, setPlayersLoading] = useState(false);
    const handleUpdateTeam = async () => {
        window.top.scrollTo(0, 0);
        setPlayersLoading(true);
        setIsUpdate(true);
        setIsModalOpen(false);
        const id = contest.contestId;
        const response = await axios.post(`${API_URL}/contests/get`, { id });

        setMatchDetail(response.data.data.matchDetails);

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
        setCaptainId(contest.captain);
        setViceCaptainId(contest.viceCaptain);
        setPlayersLoading(false);
    };

    const teamPlayerCount = useMemo(() => {
        const count = {};

        const teams = Array.from(new Set(playersSelection.map(p => p.team)));

        teams.forEach(team => {
            count[team] = 0;
        });

        selectedPlayerIds.forEach((id) => {
            const player = playersSelection.find((p) => p.id === id);
            if (player && Object.prototype.hasOwnProperty.call(count, player.team)) {
                count[player.team]++;
            }
        });

        return count;
    }, [selectedPlayerIds, players]);

    const isMaxSelected = selectedPlayerIds.length >= 11;

    const handlePlayerSelection = (playerId) => {
        setSelectedPlayerIds((prev) => {
            const isSelected = prev.includes(playerId);
            let updated = [];
            if (isSelected) {
                updated = prev.filter((id) => id !== playerId);
                const deselectedPlayer = players.find(p => p.id === playerId);
                if (captainId === playerId) setCaptainId(null);
                if (viceCaptainId === playerId) setViceCaptainId(null);
            } else if (prev.length < 11) {
                updated = [...prev, playerId];
            } else if (prev.length >= 11) {
                setError('You can only select up to 11 players');
                updated = prev;
            }

            return updated;
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
        setIsPopupOpen(false);
    };

    const closeErrorPopup = () => {
        setError('');
        setIsPopupOpen(false);
    };

    const handleUpdateContest = async () => {
        const accessToken = localStorage.getItem('accessToken');

        const contestData = {
            id,
            players: selectedPlayerIds,
            captain: captainId,
            viceCaptain: viceCaptainId,
        };

        try {
            const response = await axios.post(
                `${API_URL}/user-contest/update-team`,
                contestData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                },
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
        setIsPopupOpen(false);
    };

    const closePopup = () => {
        setIsPopupVisible(false);
    };

    const handleSubmitTeam = (e) => {
        setIsPopupOpen(true);
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
            const playerA = playersSelection.find(p => p.id === a);
            const playerB = playersSelection.find(p => p.id === b);

            const roleA = playerA?.role || '--';
            const roleB = playerB?.role || '--';

            const priorityA = rolePriority[roleA];
            const priorityB = rolePriority[roleB];

            if (priorityA !== priorityB) {
                return priorityA - priorityB;
            }

            // Same role, fall back to their order in the full players list
            return playersSelection.findIndex(p => p.id === a) - playersSelection.findIndex(p => p.id === b);
        });

        setSelectedPlayerIds(sorted);
        setIsModalOpen(true);
        // setIsPopupOpen(false);
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [activeTab]);

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
    const roleMap = {
        WK: ['WK-Batsman'],
        BAT: ['Batsman'],
        AR: ['Batting Allrounder', 'Bowling Allrounder'],
        BOWL: ['Bowler'],
    };
    const roles = Object.keys(roleMap);
    const filteredPlayers = sortedPlayers.filter(player =>
        roleMap[activeTab].includes(player.role)
    );
    const selectedCounts = {
        WK: 0,
        BAT: 0,
        AR: 0,
        BOWL: 0,
    };

    for (const role in roleMap) {
        selectedCounts[role] = sortedPlayers.filter(
            player => isPlayerSelected(player.id) && roleMap[role].includes(player.role)
        ).length;
    }

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
    const convertIn12Hours = (time) => {
        let [hours, minutes] = time ? time.split(':') : "";
        hours = parseInt(hours);

        const period = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${hours}:${minutes} ${period}`;
    }
    const [timeLeft, setTimeLeft] = useState("");

    const getTimeLeft = (matchDate, matchTime) => {
        const matchStart = new Date(`${matchDate}T${matchTime}:00`);
        const now = new Date();

        const diffMs = matchStart - now;
        if (diffMs <= 0) return "Match Started";
        const diffSec = Math.floor(diffMs / 1000);

        const days = Math.floor(diffSec / (3600 * 24))
        const hours = Math.floor(diffSec % (3600 * 24) / 3600);
        const minutes = Math.floor((diffSec % 3600) / 60);
        const seconds = diffSec % 60;

        const t = `${days > 0 ? (days == 1 ? `${days} day` : `${days} days`) : ''} ${hours > 0 ? `${hours}h` : ''} ${minutes > 0 ? `${minutes}m` : ''} ${seconds}s`
        return t;
    };
    useEffect(() => {
        const interval = setInterval(() => {
            const updated = getTimeLeft(
                contest?.matchDetails?.date,
                contest?.matchDetails?.startTime
            );
            setTimeLeft(updated);
        }, 1000);

        return () => clearInterval(interval);
    }, [contest?.matchDetails?.date, contest?.matchDetails?.startTime]);

    if (!contest)
        return (
            <>
                <div className="flex-col justify-start items-center px-4 animate-pulse">
                    <div className="h-5 w-32 bg-gray-300 rounded mb-2 mx-auto" />
                    <div className="h-6 w-48 bg-gray-300 rounded mx-auto" />

                </div>
                <div className="flex flex-col lg:flex-row justify-between gap-6 animate-pulse px-24 py-6 mt-5">
                    {/* Left: Contest Details */}

                    <div className="w-full lg:w-1/3 space-y-8">
                        <div className="h-6 w-3/4 bg-gray-300 rounded" />
                        <div className="space-y-6">
                            <div className="h-4 w-2/5 bg-gray-300 rounded" />
                            <div className="h-4 w-1/2 bg-gray-300 rounded" />
                            <div className="h-4 w-2/5 bg-gray-300 rounded" />
                            <div className="h-4 w-1/2 bg-gray-300 rounded" />
                            <div className="h-4 w-2/5 bg-gray-300 rounded" />
                            <div className="h-4 w-1/2 bg-gray-300 rounded" />

                        </div>
                    </div>

                    {/* Right: Player List */}
                    <div className="w-full min-h-screen flex flex-col items-center">
                        <h2 className="text-2xl font-bold text-gray-500 mb-4">My Points: <span className="text-green-500">0</span></h2>

                        <div className="bg-green-600 rounded-2xl w-[360px] h-[430px] relative p-4" style={{
                            backgroundImage: `url(${ground})`,
                            backgroundSize: '99% 96%',
                        }}>

                            <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-24 mt-4">
                                {[...Array(2)].map((_, i) => (
                                    <div key={i} className="flex flex-col items-center">
                                        <FontAwesomeIcon
                                            icon={faUser}
                                            className="text-green-800 text-3xl mb-1"
                                        />
                                        <div className="w-14 h-4 bg-gray-300 rounded" />
                                    </div>
                                ))}
                            </div>

                            <div className="absolute top-[120px] left-1/2 -translate-x-1/2 flex gap-20 mt-2">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="flex flex-col items-center">
                                        <FontAwesomeIcon
                                            icon={faUser}
                                            className="text-green-800 text-3xl mb-1"
                                        />
                                        <div className="w-14 h-4 bg-gray-300 rounded" />
                                    </div>
                                ))}
                            </div>
                            <div className="absolute top-[220px] left-1/2 -translate-x-1/2 flex gap-20">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="flex flex-col items-center">
                                        <FontAwesomeIcon
                                            icon={faUser}
                                            className="text-green-800 text-3xl mb-1"
                                        />
                                        <div className="w-14 h-4 bg-gray-300 rounded" />
                                    </div>
                                ))}
                            </div>
                            <div className="absolute top-[320px] left-1/2 -translate-x-1/2 flex gap-20">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="flex flex-col items-center">
                                        <FontAwesomeIcon
                                            icon={faUser}
                                            className="text-green-800 text-3xl mb-1"
                                        />
                                        <div className="w-14 h-4 bg-gray-300 rounded" />
                                    </div>
                                ))}
                            </div>





                        </div>

                        <button className="mt-6 bg-gray-300 text-white px-6 py-2 rounded cursor-not-allowed">
                            Loading...
                        </button>
                    </div>
                </div>
            </>
        );

    return (
        <div>
            {isWinner && (
                <Confetti
                    width={confettiSize.width}
                    height={confettiSize.height}
                    numberOfPieces={300}
                    gravity={0.2}
                />
            )}
            {(() => {
                const timeLeft = getTimeLeft(
                    contest.matchDetails.date,
                    contest.matchDetails.startTime,
                );
                return (
                    <div className="text-center text-sm text-red-500 font-semibold">
                        <div className="mb-1 flex px-2 py-1 rounded-md items-center text-center justify-center">
                            <img src={clock} alt="" className='h-3 w-3 mr-1' />
                            {contest?.matchDetails?.matchEnded ? "Match Ended" : (
                                <span className="font-bold">
                                    {timeLeft}{timeLeft === "Match Started" ? "" : " left"}
                                </span>
                            )}
                        </div>


                    </div>
                );
            })()}
            <h1 className="text-xl sm:text-2xl font-bold mb-5 text-gray-600 text-center tracking-wide">
                <span className="block sm:inline">{contest.matchDetails.teamA}</span>
                <span className="block sm:inline sm:text-xl text-base text-gray-400 tracking-tighter mx-2">vs</span>
                <span className="block sm:inline">{contest.matchDetails.teamB}</span>
            </h1>

            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/2 sm:p-4 sm:text-xl text-base text-gray-600 p-4">
                        <h2 className="sm:text-2xl text-lg font-bold">Contest Details:</h2>

                        <p className="mt-4">
                            Status:{' '}
                            {contest.matchDetails.matchStarted ? (
                                contest.matchDetails.matchEnded ? (
                                    <span className=" text-red-600 font-medium ">
                                        Completed
                                    </span>
                                ) : (
                                    <span className="text-green-500 font-medium ">
                                        Live
                                    </span>
                                )
                            ) : (
                                <span className=" text-orange-500 font-medium ">
                                    Upcoming
                                </span>
                            )}
                        </p>
                        <p className="mt-4">
                            Series:{' '}
                            <span className="font-semibold text-fuchsia-700">
                                {contest.matchDetails.series}
                            </span>
                        </p>
                        <p className=" mt-4">
                            Match Type:{' '}
                            <span className="font-semibold uppercase text-blue-600">
                                {contest.matchDetails.matchType}
                            </span>
                        </p>
                        <p className=" mt-4">
                            Venue:{' '}
                            <span className="font-semibold  text-blue-600">
                                {contest.matchDetails.venue}
                            </span>
                        </p>
                        <p className=" mt-4">
                            Date:{' '}
                            <span className="font-semibold text-orange-600">
                                {contest.matchDetails?.date ? contest.matchDetails.date
                                    .split('-')
                                    .reverse()
                                    .join('-') : ""}
                            </span>
                        </p>
                        <p className=" mt-4">
                            Start Time(IST):{' '}
                            <span className="font-semibold text-orange-600">
                                {convertIn12Hours(contest.matchDetails.startTime)}
                            </span>
                        </p>

                        <p className=" mt-4">
                            Prize Pool:{' '}
                            <span className="font-semibold text-red-600">
                                ₹{contest.contestDetails.prizePool}
                            </span>
                        </p>
                        <p className=" mt-4">
                            Entry:{' '}
                            <span className="font-semibold text-green-600">
                                ₹{contest.contestDetails.entryFee}
                            </span>
                        </p>
                        <p className=" mt-4">
                            Spots:{' '}
                            <span className="font-semibold text-red-600">
                                {contest.contestDetails.maxParticipants}
                            </span>
                        </p>
                        <p className="mt-4 mb-3">
                            Status:{' '}
                            <span className={`font-semibold  uppercase ${contest.result === 'win' ? 'text-green-600' : 'text-red-600'}`}>
                                {contest.result}
                            </span>
                        </p>
                    </div>
                    <p className='sm:hidden border-t-2 border-gray-400 mb-2'></p>

                    {!isUpdate && (
                        <div className="md:w-[55%]">
                            <h2 className="text-xl font-bold text-center text-gray-400">
                                My Points:{' '}
                                <span className="text-3xl text-green-600">{userPoints}</span>
                                {/* <span className="text-3xl text-green-600">{contest.points}</span> */}
                            </h2>

                            <div className="bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
                                <div
                                    className={`relative bg-green-700 p-4 sm:p-6 rounded-lg max-w-full sm:max-w-lg mx-4 my-4 bg-cover bg-center overflow-auto sm:w-[35%]'
                                        }`}
                                    style={{
                                        backgroundImage: `url(${ground})`,
                                        backgroundSize: '99% 96%',
                                    }}
                                >
                                    {/* First 2 Players */}
                                    <div className="flex justify-center gap-20 mt-4 mb-7 flex-wrap">
                                        {sortedUserPlayers.slice(0, 2).map((player) => (
                                            <div key={player.id} className="text-center">
                                                <div className="relative">
                                                    {captainId === player.id && (
                                                        <span className={`flex items-center justify-center w-6 h-6 absolute sm:-top-3 sm:left-2 -top-4 text-sm text-white font-medium bg-gray-500 p-1 rounded-full z-10 ${player.playerImg === "https://h.cricapi.com/img/icon512.png" ? '-left-4' : 'sm:-left-2 -left-3'}`}>
                                                            C
                                                        </span>
                                                    )}
                                                    {viceCaptainId === player.id && (
                                                        <span className={`flex items-center justify-center w-6 h-6 absolute sm:-top-3 sm:left-2 -top-4 text-xs text-white font-medium bg-gray-500 p-1 rounded-full z-10 ${player.playerImg === "https://h.cricapi.com/img/icon512.png" ? '-left-3' : 'sm:-left-2 -left-1'}`}>
                                                            VC
                                                        </span>
                                                    )}
                                                    {player.playerImg !== "https://h.cricapi.com/img/icon512.png" ? (
                                                        <img
                                                            src={player.playerImg}
                                                            alt={player.name}
                                                            className="h-12 w-12 object-contain rounded-full mx-auto"
                                                        />
                                                    ) : (
                                                        <div className="h-12 w-12 flex items-center justify-center mx-auto">
                                                            <FontAwesomeIcon
                                                                icon={faUser}
                                                                className="text-green-900 text-4xl"
                                                            />
                                                        </div>
                                                    )}

                                                </div>
                                                <span className="block text-white rounded-sm py-px bg-red-600 sm:text-sm sm:w-20 w-16 whitespace-nowrap overflow-hidden text-ellipsis mt-1 text-xs text-center">
                                                    {formatName(player.name, 85)}
                                                </span>
                                                <span className="block text-white text-xs w-16 sm:w-20 mx-auto px-1 truncate">
                                                    {player?.points} Pts
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Remaining Players */}
                                    {[2, 5, 8].map((startIdx, index) => (
                                        <div
                                            key={index}
                                            className="grid grid-cols-3 gap-16 mt-12 justify-items-center"
                                        >
                                            {sortedUserPlayers.slice(startIdx, startIdx + 3).map((player) => (
                                                <div key={player.id} className="text-center">
                                                    <div className="relative">
                                                        {player.id === contest.captain && (
                                                            <span className={`flex items-center justify-center w-6 h-6 absolute -top-3 text-sm text-white font-medium bg-gray-500 p-1 rounded-full z-10 ${player.playerImg === "https://h.cricapi.com/img/icon512.png" ? 'left-2' : '-left-1'}`}>
                                                                C
                                                            </span>
                                                        )}
                                                        {player.id === contest.viceCaptain && (
                                                            <span className={`flex items-center justify-center w-6 h-6 absolute -top-3 text-xs text-white font-medium bg-gray-500 p-1 rounded-full z-10 ${player.playerImg === "https://h.cricapi.com/img/icon512.png" ? 'left-2' : '-left-1'}`}>
                                                                VC
                                                            </span>
                                                        )}
                                                        {player.playerImg !== "https://h.cricapi.com/img/icon512.png" ? (
                                                            <img
                                                                src={player.playerImg}
                                                                alt={player.name}
                                                                className="h-12 w-12 object-contain rounded-full mx-auto"
                                                            />
                                                        ) : (
                                                            <div className="h-12 w-12 flex items-center justify-center mx-auto">
                                                                <FontAwesomeIcon
                                                                    icon={faUser}
                                                                    className="text-green-900 text-4xl"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="block text-white rounded-sm py-px bg-red-600 sm:text-sm sm:w-20 w-16 whitespace-nowrap overflow-hidden text-ellipsis mt-1 text-xs text-center">
                                                        {formatName(player.name, 85)}
                                                    </span>
                                                    <span className="block text-white text-xs w-16 sm:w-20 mx-auto px-1 truncate">
                                                        {player?.points} Pts
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {!isMatchStarted && (
                                <div className="flex justify-center">
                                    <button
                                        onClick={handleUpdateTeam}
                                        className="bg-green-600 hover:bg-green-500 text-white rounded-md p-2 mt-2"
                                    >
                                        Update Team
                                    </button>
                                </div>
                            )}
                        </div>

                    )}

                    {isUpdate && (
                        <div className="md:w-[60%]">
                            <div className='flex '>
                                {Object.entries(teamPlayerCount).map(([teamName, count]) => (
                                    <div key={teamName} className='mx-auto'>
                                        <div className="px-4 py-2 rounded-xl   font-bold ">
                                            {teamName === contest.matchDetails.teamA ?
                                                <div className="flex items-center gap-2">
                                                    <img
                                                        src={matchDetail.teamAImg}
                                                        alt="Team A"
                                                        className="h-9 object-contain"
                                                    />
                                                    <p className='text-lg sm:text-xl text-gray-600'>{contest.matchDetails.teamAAcronym}</p>
                                                    <p>{" : "}</p>
                                                    <p className='text-xl sm:text-2xl text-red-500'>{count}</p>

                                                </div>
                                                : <div className="flex items-center gap-2">
                                                    <p className='text-xl sm:text-2xl text-red-500'>{count}</p>
                                                    <p>{" : "}</p>
                                                    <p className='text-lg sm:text-xl text-gray-600'>{contest.matchDetails.teamBAcronym}</p>
                                                    <img
                                                        src={matchDetail.teamBImg}
                                                        alt="Team B"
                                                        className="h-9 object-contain"
                                                    />
                                                </div>}
                                        </div>
                                    </div>
                                ))}


                            </div>
                            <div className="flex bg-gray-100 rounded-sm overflow-hidden shadow-md w-full mt-4">
                                {roles.map(role => (
                                    <button
                                        key={role}
                                        onClick={() => setActiveTab(role)}
                                        className={`flex-1 sm:px-6 py-2 text-xs sm:text-sm font-bold capitalize transition-colors duration-200  ${activeTab === role
                                            ? "bg-white text-red-600 shadow border-b-2 border-red-600"
                                            : "text-gray-600 hover:bg-gray-300"
                                            }`}
                                    >
                                        {role} ({selectedCounts[role]})
                                    </button>
                                ))}

                            </div>
                            <form
                                className=""
                                onSubmit={handleSubmitTeam}
                            >

                                <div className="overflow-x-auto">
                                    <div className="h-[45vh] overflow-y-auto bg-white border-b-2 border-gray-300" ref={scrollRef}>
                                        <table className="min-w-full bg-white border border-gray-300 rounded-3xl">
                                            <thead className="sticky top-0 bg-slate-300 z-10">
                                                <tr className="text-left border-b-2 text-sm sm:text-md">
                                                    {/* <th className="py-2 text-md px-4 w-40">Role</th> */}
                                                    <th className="px-4">Team</th>
                                                    <th className="py-2 px-4 text-center">Image</th>
                                                    <th className="py-2 text-sm sm:text-md px-4 w-56">Player Name</th>
                                                    <th className="py-2 px-4 text-center">C</th>
                                                    <th className="py-2 px-4 text-center">VC</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {playersLoading ? (
                                                    <tr>
                                                        <td colSpan={4} className="h-[45vh]">
                                                            <div className="flex justify-center items-center h-full">
                                                                <div className="w-10 h-10 border-4 border-gray-300 border-t-white rounded-full animate-spin"></div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) :
                                                    filteredPlayers.map((player) => (
                                                        <tr
                                                            key={player.id}
                                                            className={`text-xs sm:text-sm ${isPlayerSelected(player.id)
                                                                ? 'bg-yellow-50 cursor-pointer'
                                                                : 'hover:bg-fuchsia-50'
                                                                } ${!isPlayerSelected(player.id) && isMaxSelected ? 'cursor-not-allowed opacity-40 ' : 'cursor-pointer'
                                                                }`
                                                            }
                                                            onClick={() => handlePlayerSelection(player.id)}
                                                        >
                                                            {/* <td className="py-2 px-4 border-b">{player.role}</td> */}
                                                            <td className="py-2 px-7 border-b">{player.team === contest.matchDetails.teamA ? contest.matchDetails.teamAAcronym : contest.matchDetails.teamBAcronym}</td>
                                                            <td className="py-2 px-4 border-b text-center">
                                                                {
                                                                    player.playerImg !== "https://h.cricapi.com/img/icon512.png" ? (
                                                                        <img
                                                                            src={player.playerImg}
                                                                            alt="playerImage"
                                                                            className="h-7 w-7 object-contain rounded-sm inline-block text-center"
                                                                        />
                                                                    ) : (
                                                                        <FontAwesomeIcon
                                                                            icon={faUser}
                                                                            className="text-green-900 h-7 w-7 rounded-sm inline-block align-middle"
                                                                        />
                                                                    )
                                                                }
                                                            </td>
                                                            <td className="py-2 px-4 border-b">{player.name}</td>

                                                            <td className="py-2 px-4 border-b text-center">
                                                                <label
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    className={`cursor-pointer inline-block w-10 h-6 leading-6 text-center rounded-full ${captainId === player.id ? 'bg-green-500 text-white' : 'bg-gray-200 text-black'
                                                                        } ${isPlayerSelected(player.id) && viceCaptainId !== player.id
                                                                            ? ''
                                                                            : 'opacity-50 cursor-not-allowed'
                                                                        }`}
                                                                >
                                                                    <input
                                                                        type="radio"
                                                                        name="captain"
                                                                        value={player.id}
                                                                        checked={captainId === player.id}
                                                                        onClick={(e) => e.stopPropagation()}
                                                                        onChange={() => handleCaptainChange(player.id)}
                                                                        className="hidden"
                                                                        disabled={
                                                                            !isPlayerSelected(player.id) || viceCaptainId === player.id
                                                                        }
                                                                    />
                                                                    2x
                                                                </label>
                                                            </td>
                                                            <td className="py-2 px-4 border-b text-center">
                                                                <label
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    className={`cursor-pointer inline-block w-10 h-6 leading-6 text-center rounded-full ${viceCaptainId === player.id ? 'bg-green-500 text-white' : 'bg-gray-200 text-black'
                                                                        } ${isPlayerSelected(player.id) && captainId !== player.id
                                                                            ? ''
                                                                            : 'opacity-50 cursor-not-allowed'
                                                                        }`}
                                                                >
                                                                    <input
                                                                        type="radio"
                                                                        name="captain"
                                                                        value={player.id}
                                                                        checked={viceCaptainId === player.id}
                                                                        onClick={(e) => e.stopPropagation()}
                                                                        onChange={() => handleViceCaptainChange(player.id)}
                                                                        className="hidden"
                                                                        disabled={
                                                                            !isPlayerSelected(player.id) || captainId === player.id
                                                                        }
                                                                    />
                                                                    1.5x
                                                                </label>
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                {/* //Display error popup  */}
                                {error && (
                                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4" onClick={closeErrorPopup}>
                                        <div className="bg-white p-6 rounded-lg shadow-lg text-center w-full max-w-sm sm:max-w-sm md:max-w-sm lg:max-w-sm" onClick={(e) => e.stopPropagation()}>
                                            <img
                                                className="sm:h-12 sm:w-12 h-9 w-9 mx-auto"
                                                src={warning}
                                                alt="Warning"
                                            />
                                            <p className="text-base sm:text-lg text-gray-700 font-semibold mb-4 mt-6">
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
                                        className="relative bg-green-700 p-4 sm:p-6 rounded-lg  max-w-lg mx-4 my-4 bg-cover bg-center"
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
                                                const player = playersSelection.find(
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
                                                                    <span className="flex items-center justify-center w-6 h-6 absolute sm:-top-3 sm:left-2 -top-4 left-1 text-sm text-white font-medium bg-gray-500 p-1 rounded-full">
                                                                        C
                                                                    </span>
                                                                )}
                                                            {viceCaptainId ===
                                                                player.id && (
                                                                    <span className="flex items-center justify-center w-6 h-6 absolute sm:-top-3 sm:left-2 -top-4 left-1 text-xs text-white font-medium bg-gray-500 p-1 rounded-full">
                                                                        VC
                                                                    </span>
                                                                )}
                                                            <FontAwesomeIcon
                                                                icon={faUser}
                                                                className="text-green-900 text-3xl"
                                                            />{' '}
                                                        </div>
                                                        <span className="block text-white rounded-sm py-px bg-red-600 sm:text-sm sm:w-20 w-16 whitespace-nowrap overflow-hidden text-ellipsis mt-1 text-xs text-center">
                                                            {formatName(player.name, 85)}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {[2, 5, 8].map((startIdx, index) => (
                                            <div
                                                key={index}
                                                className="grid grid-cols-3 gap-16 mt-12"
                                            >
                                                {selectedPlayerIds
                                                    .slice(startIdx, startIdx + 3)
                                                    .map((id) => {
                                                        const player = playersSelection.find((p) => p.id === id);
                                                        return (
                                                            <div key={player.id} className="flex flex-col items-center text-center">
                                                                <div className="relative">
                                                                    {captainId ===
                                                                        player.id && (
                                                                            <span className="flex items-center justify-center w-6 h-6 absolute -top-3 -left-5 text-sm text-white font-medium bg-gray-500 p-1 rounded-full">
                                                                                C
                                                                            </span>
                                                                        )}
                                                                    {viceCaptainId ===
                                                                        player.id && (
                                                                            <span className="flex items-center justify-center w-6 h-6 absolute -top-3 -left-5 text-xs text-white font-medium bg-gray-500 p-1 rounded-full">
                                                                                VC
                                                                            </span>
                                                                        )}
                                                                    <FontAwesomeIcon
                                                                        icon={faUser}
                                                                        className="text-green-900 text-3xl"
                                                                    />
                                                                </div>
                                                                <span className="block text-white rounded-sm py-px bg-red-600 sm:text-sm sm:w-20 w-16 whitespace-nowrap overflow-hidden text-ellipsis mt-1 text-xs text-center">
                                                                    {formatName(player.name, 85)}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        ))}


                                        <hr className="mt-5 sm:mt-10" />
                                        <div className="flex">
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

                    {opponentPlayers.length === 0 && isMatchStarted ? (
                        <div className="md:w-[55%] animate-pulse">
                            <h2 className="text-xl font-bold text-center text-gray-400">
                                Opponent Points: {' '}
                                < span className="text-3xl text-green-600">{0}</span>
                            </h2>

                            <div className="bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
                                <div
                                    className="relative bg-green-700 p-4 sm:p-6 rounded-lg w-full sm:max-w-lg mx-4 my-4 bg-cover bg-center overflow-auto sm:w-full"
                                    style={{
                                        backgroundImage: `url(${ground})`,
                                        backgroundSize: '99% 96%',
                                    }}
                                >
                                    <div className="flex justify-center gap-20 mt-4 mb-7 flex-wrap">
                                        {[...Array(2)].map((_, i) => (
                                            <div key={i} className="text-center">
                                                <div className="relative">
                                                    <FontAwesomeIcon
                                                        icon={faUser}
                                                        className="text-green-800 text-3xl mb-1"
                                                    />
                                                </div>
                                                <div className="w-16 h-5 bg-gray-300 rounded mb-1 mx-auto" />
                                                <div className="w-16 h-4 mx-auto" />
                                            </div>
                                        ))}
                                    </div>

                                    {[...Array(3)].map((_, rowIdx) => (
                                        <div
                                            key={rowIdx}
                                            className="grid grid-cols-3 gap-16 mt-12 justify-items-center"
                                        >
                                            {[...Array(3)].map((_, colIdx) => (
                                                <div key={colIdx} className="text-center">
                                                    <div className="relative">
                                                        <FontAwesomeIcon
                                                            icon={faUser}
                                                            className="text-green-800 text-3xl mb-1"
                                                        />
                                                    </div>
                                                    <div className="w-16 h-5 bg-gray-300 rounded mb-1 mx-auto" />
                                                    <div className="w-16 h-3 mx-auto" />
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                    <div className='mt-1'></div>
                                </div>
                            </div>
                        </div>
                    ) :
                        opponentPlayers.length > 0 &&
                        (
                            <div className="md:w-[55%]">
                                <h2 className="text-xl font-bold text-center text-gray-400">
                                    Opponent Points : {' '}
                                    < span className="text-3xl text-green-600">{opponentContest?.points}</span>
                                </h2>
                                <div className="bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
                                    <div
                                        className={`relative bg-green-700 p-4 sm:p-6 rounded-lg  max-w-full sm:max-w-lg mx-4 my-4 bg-cover bg-center overflow-auto ${opponentPlayers?.length === 0 ? 'sm:w-[65%]' : 'sm:w-full'
                                            }`}
                                        style={{
                                            backgroundImage: `url(${ground})`,
                                            backgroundSize: '99% 96%',
                                        }}
                                    >
                                        <div className="flex justify-center gap-20 mt-4 mb-7 flex-wrap">
                                            {sortedOpponentPlayers.slice(0, 2).map((player) => (
                                                <div key={player.id} className="text-center">
                                                    <div className="relative">
                                                        {opponentContest.captain === player.id && (
                                                            <span className="flex items-center justify-center w-6 h-6 absolute sm:-top-3 sm:left-2 -top-4 left-0 sm:text-sm text-xs text-white font-medium bg-gray-500 p-1 rounded-full">
                                                                C
                                                            </span>
                                                        )}
                                                        {opponentContest.viceCaptain === player.id && (
                                                            <span className="flex items-center justify-center w-6 h-6 absolute sm:-top-3 sm:left-2 -top-4 left-0 sm:text-xs text-[.67rem] text-white font-medium bg-gray-500 p-1 rounded-full">
                                                                VC
                                                            </span>
                                                        )}
                                                        <FontAwesomeIcon
                                                            icon={faUser}
                                                            className="text-green-900 text-3xl"
                                                        />
                                                    </div>
                                                    <span className="block text-white rounded-sm py-px bg-red-600 sm:text-sm sm:w-20 w-16 whitespace-nowrap overflow-hidden text-ellipsis mt-1 text-xs text-center">
                                                        {formatName(player.name, 85)}
                                                    </span>
                                                    <span className="block text-white text-xs w-16 sm:w-20 mx-auto px-1 truncate">
                                                        {player?.points} Pts
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        {[2, 5, 8].map((startIdx, index) => (
                                            <div
                                                key={index}
                                                className="grid grid-cols-3 gap-16 mt-12 justify-items-center"
                                            >
                                                {sortedOpponentPlayers.slice(startIdx, startIdx + 3).map((player) => (
                                                    <div key={player.id} className="text-center">
                                                        <div className="relative">
                                                            {player.id === opponentContest.captain && (
                                                                <span className="flex items-center justify-center w-6 h-6 absolute -top-3 -left-0 sm:left-2 sm:text-sm text-xs text-white font-medium bg-gray-500 p-1 rounded-full">
                                                                    C
                                                                </span>
                                                            )}
                                                            {player.id === opponentContest.viceCaptain && (
                                                                <span className="flex items-center justify-center w-6 h-6 absolute -top-3 -left-0 sm:left-2 sm:text-xs text-[.67rem] text-white font-medium bg-gray-500 p-1 rounded-full">
                                                                    VC
                                                                </span>
                                                            )}
                                                            <FontAwesomeIcon
                                                                icon={faUser}
                                                                className="text-green-900 text-3xl"
                                                            />
                                                        </div>
                                                        <span className="block text-white rounded-sm py-px bg-red-600 sm:text-sm sm:w-20 w-16 whitespace-nowrap overflow-hidden text-ellipsis mt-1 text-xs text-center">
                                                            {formatName(player.name, 85)}
                                                        </span>
                                                        <span className="block text-white text-xs w-16 sm:w-20 mx-auto px-1 truncate">
                                                            {player?.points} Pts
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        )
                    }
                </div >
                {
                    isPopupVisible && (
                        <Popup
                            message={popupMessage}
                            onClose={closePopup}
                        />
                    )
                }
            </div >
        </div >
    );
};
export default UserContestDetails;
