import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import ground from '../../assets/ground.jpg';
import Popup from '../../features/Popup';
import { useMemo } from 'react';
import clock from "../../assets/clock.png";
import warning from '../../assets/warning.png';
import close from '../../assets/close.png';
import hety from "../../assets/hety.png";
import AddMoneyPopup from '../Payment/AddMoneyPopup';
import { set } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBalance, fetchContestDetail, createContest } from '../../features/slice/appSlice';
const API_URL = import.meta.env.VITE_API_URL;

const ContestDetails = () => {
    const { id } = useParams(); // Get the contest ID from the URL
    const accessToken = localStorage.getItem('accessToken');
    const popupRef = useRef();

    const dispatch = useDispatch();
    const { balance, contestDetail } = useSelector((state) => state.app);

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

    const [loading, setLoading] = useState(false);
    const [walletSummaryPopup, setWalletSummaryPopup] = useState(false);
    // const [balance, setBalance] = useState(0);
    const [remBalance, setRemBalance] = useState(0);

    const [joinContestLoading, setJoinContestLoading] = useState(false);

    const [activeTab, setActiveTab] = useState('WK');


    const scrollRef = useRef(null);

    const [isImageLoaded, setIsImageLoaded] = useState(false);

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.src = ground;
        img.onload = () => setIsImageLoaded(true);
    }, []);


    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [activeTab]);

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

    const rolePriority = {
        'WK-Batsman': 1,
        Batsman: 2,
        'Batting Allrounder': 3,
        'Bowling Allrounder': 4,
        Bowler: 5,
        '--': 6,
    };

    const handleSubmitTeam = (e) => {
        setIsPopupOpen(true);
        e.preventDefault();
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
        setIsPopupOpen(false);
    };

    const closeErrorPopup = () => {
        setError('');
        setIsPopupOpen(false);
    };

    const handleWalletSummaryPopup = async () => {
        setLoading(true);

        try {
            // const response = await axios.get(`${API_URL}/users/get-balance`, {
            //     headers: {
            //         Authorization: `Bearer ${accessToken}`,
            //     },
            // });
            // setBalance(response.data.data.walletBalance);
            // setRemBalance(response.data.data.walletBalance - contest.entryFee);
            // setWalletSummaryPopup(true);

            await dispatch(fetchBalance());
            setRemBalance(balance - contest.entryFee)
            setWalletSummaryPopup(true);
        } catch (error) {
            console.error("Error fetching wallet balance", error);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinContest = async () => {
        setJoinContestLoading(true);
        setWalletSummaryPopup(false);

        const timeLeft = getTimeLeft(
            contest.matchDetails.date,
            contest.matchDetails.startTime,
        );
        if (timeLeft === "Match Started") {
            alert('Contest has already started');
            setIsModalOpen(false);
            navigate('/');
            return;
        }

        const contestData = {
            contestId: id,
            players: selectedPlayerIds,
            captain: captainId,
            viceCaptain: viceCaptainId,
        };

        try {
            // const response = await axios.post(
            //     `${API_URL}/user-contest/create`,
            //     contestData,
            //     {
            //         headers: {
            //             Authorization: `Bearer ${accessToken}`,
            //         },
            //     },
            // );

            const res = await dispatch(createContest(contestData));
            if (createContest.fulfilled.match(res)) {
                // console.log("===>", res.payload);
                setPopupMessage('Contest Joined Successfully!');
                setIsPopupVisible(true);
            }
            window.dispatchEvent(new CustomEvent('updateBalance'));
            // if (response.data.statusCode === 200) {
            // navigate('/my-contests');
            // }

            // const opponentData = {
            //     userContestId: response.data.data._id,
            //     contestId: id,
            // };
            // const res = await axios.post(
            //     `${API_URL}/opponent/create`,
            //     opponentData,
            // );
            // console.log('Create opponent res: ', res);
        } catch (error) {
            alert(
                error.response?.data?.message ||
                'Failed! Contest Not Joined...',
            );

            console.log(
                error.response?.data?.message || 'Failed to create contest',
            );
        } finally {
            setJoinContestLoading(false);
        }

    };
    const closePopup = () => {
        setIsPopupVisible(false);
        navigate('/my-contests');
    };


    useEffect(() => {

        const fetchContestDetails = async () => {
            // const response = await axios.post(`${API_URL}/contests/get`, {
            //     id,
            // });

            const res = await dispatch(fetchContestDetail({ id }));
            const contestDetail = res.payload;
            // console.log("-> ", contestDetail);
            if (fetchContestDetail.fulfilled.match(res)) {
                setContest(contestDetail);
                const playersResponse1 =
                    contestDetail.squadDetails.squad[0].players;
                const updatedPlayersResponse1 = playersResponse1.map((player) => ({
                    ...player,
                    team: contestDetail.squadDetails.squad[0].teamName,
                }));

                const playersResponse2 =
                    contestDetail.squadDetails.squad[1].players;
                const updatedPlayersResponse2 = playersResponse2.map((player) => ({
                    ...player,
                    team: contestDetail.squadDetails.squad[1].teamName,
                }));
                const combinedSquad = updatedPlayersResponse1.concat(
                    updatedPlayersResponse2,
                );
                setPlayers(combinedSquad);
            }
            else {
                console.log("Error in getting contest");
            }
        };
        fetchContestDetails();
    }, [id, dispatch]);


    const sortedPlayers = players.sort((a, b) => {
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
        let [hours, minutes] = time.split(':');
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
                contest.matchDetails.date,
                contest.matchDetails.startTime
            );
            setTimeLeft(updated);
        }, 1000);

        return () => clearInterval(interval);
    }, [contest?.matchDetails?.date, contest?.matchDetails?.startTime]);

    const closeWalletSummaryPopup = () => {
        setWalletSummaryPopup(false);
    }

    const handleAddMoneyPopup = () => {
        popupRef.current?.paymentFunction(Math.abs(remBalance));
        setWalletSummaryPopup(false);
    }

    if (!contest)
        return (
            <>
                <div className="flex-col justify-start items-center px-4 animate-pulse">
                    <div className="h-5 w-32 bg-gray-300 rounded mb-2 mx-auto" />
                    <div className="h-6 w-48 bg-gray-300 rounded mx-auto" />

                </div>
                <div className="flex flex-col lg:flex-row justify-between gap-6 animate-pulse py-10 px-24˳`˳ mt-5">
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
                    <div className="w-full lg:w-2/3">
                        {/* Header */}
                        <div className="h-6 w-1/2 bg-gray-300 rounded mb-7 mx-auto" />

                        {/* Player Rows */}
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="grid grid-cols-4 gap-4 mb-3 w-2/3 mx-auto">
                                <div className="h-4 w-full bg-gray-300 rounded" />
                                <div className="h-4 w-full bg-gray-300 rounded" />
                                <div className="h-4 w-full bg-gray-300 rounded" />
                                <div className="h-4 w-full bg-gray-300 rounded" />
                            </div>
                        ))}

                        {/* Submit Button */}
                        <div className="mt-16">
                            <div className="h-10 w-32 bg-gray-300 rounded mx-auto" />
                        </div>
                    </div>
                </div>
            </>
        );

    return (
        <div className="container mx-auto ">

            {(() => {
                const timeLeft = getTimeLeft(
                    contest.matchDetails.date,
                    contest.matchDetails.startTime,
                );
                return (
                    <div className="text-center text-sm text-red-500 font-semibold">
                        <div className="mb-1 flex px-2 py-1 rounded-md items-center text-center justify-center">
                            <img src={clock} alt="" className='h-3 w-3 mr-1' />
                            <span className="font-bold">
                                {timeLeft}{timeLeft === "Match Started" ? "" : " left"}
                            </span>
                        </div>


                    </div>
                );
            })()}
            <h1 className="text-xl sm:text-2xl font-bold mb-5 text-gray-600 text-center tracking-wide">
                <span className="block sm:inline">{contest.matchDetails.teamA}</span>
                <span className="block sm:inline sm:text-xl text-base text-gray-400 tracking-tighter mx-2">vs</span>
                <span className="block sm:inline">{contest.matchDetails.teamB}</span>
            </h1>

            <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 p-4 sm:text-xl text-base text-gray-600">
                    <h2 className="sm:text-2xl text-lg font-bold">Contest Details:</h2>
                    <p className="mt-4">
                        Series:{' '}
                        <span className="font-semibold text-fuchsia-700">
                            {contest.matchDetails.series}
                        </span>
                    </p>
                    <p className="mt-4">
                        Name:{' '}
                        <span className="font-semibold text-fuchsia-600">
                            {contest.matchDetails.name}
                        </span>
                    </p>
                    <p className="mt-4 ">
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
                            {contest.matchDetails.date
                                .split('-')
                                .reverse()
                                .join('-')}
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
                            ₹{contest.prizePool}
                        </span>
                    </p>
                    <p className=" mt-4">
                        Entry:{' '}
                        <span className="font-semibold text-green-600">
                            ₹{contest.entryFee}
                        </span>
                    </p>
                    <p className=" mt-4">
                        Spots:{' '}
                        <span className="font-semibold text-red-600">
                            {contest.maxParticipants}
                        </span>
                    </p>
                </div>
                <p className='sm:hidden border-t-2 border-gray-400 mb-2'></p>

                <div className="md:w-[60%]">
                    <div className='flex '>
                        {Object.entries(teamPlayerCount).map(([teamName, count]) => (
                            <div key={teamName} className='mx-auto'>
                                <div className="px-4 py-2 rounded-xl   font-bold ">
                                    {teamName === contest.matchDetails.teamA ?
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={contest.matchDetails.teamAImg}
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
                                                src={contest.matchDetails.teamBImg}
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
                                        {filteredPlayers.map((player) => (
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
                                                <td className="py-2 px-4 border-b">{player.team === contest.matchDetails.teamA ? contest.matchDetails.teamAAcronym || contest.matchDetails.teamA : contest.matchDetails.teamBAcronym || contest.matchDetails.teamB}</td>
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

                        {error && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-8" onClick={closeErrorPopup}>
                                <div className="bg-white p-4 rounded-lg shadow-lg text-center w-full max-w-sm sm:max-w-sm md:max-w-sm lg:max-w-sm" onClick={(e) => e.stopPropagation()}>
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
                            className="bg-green-600 text-white px-4 py-2 rounded mt-5 mb-11 mx-auto block hover:bg-green-700"
                        >
                            Submit Team
                        </button>
                    </form>

                    {
                        isModalOpen && isImageLoaded && (
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
                                                                <span className={`flex items-center justify-center w-6 h-6 absolute sm:-top-3 -top-4 text-sm text-white font-medium bg-gray-500 p-1 rounded-full z-10 ${player.playerImg === "https://h.cricapi.com/img/icon512.png" ? '-left-4' : 'sm:-left-2 -left-3'}`}>
                                                                    C
                                                                </span>
                                                            )}
                                                        {viceCaptainId ===
                                                            player.id && (
                                                                <span className={`flex items-center justify-center w-6 h-6 absolute sm:-top-3 -top-4 text-xs text-white font-medium bg-gray-500 p-1 rounded-full z-10 ${player.playerImg === "https://h.cricapi.com/img/icon512.png" ? '-left-3' : 'sm:-left-2 -left-1'}`}>
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
                                                    const player = players.find((p) => p.id === id);
                                                    return (
                                                        <div key={player.id} className="flex flex-col items-center text-center">
                                                            <div className="relative">
                                                                {captainId ===
                                                                    player.id && (
                                                                        <span className={`flex items-center justify-center w-6 h-6 absolute -top-3 text-sm text-white font-medium bg-gray-500 p-1 rounded-full z-10 ${player.playerImg === "https://h.cricapi.com/img/icon512.png" ? '-left-2' : '-left-5'}`}>
                                                                            C
                                                                        </span>
                                                                    )}
                                                                {viceCaptainId ===
                                                                    player.id && (
                                                                        <span className={`flex items-center justify-center w-6 h-6 absolute -top-3 text-xs text-white font-medium bg-gray-500 p-1 rounded-full z-10 ${player.playerImg === "https://h.cricapi.com/img/icon512.png" ? '-left-2' : '-left-5'}`}>
                                                                            VC
                                                                        </span>
                                                                    )}
                                                                {player.playerImg !== "https://h.cricapi.com/img/icon512.png" ? (
                                                                    <img
                                                                        src={player.playerImg}
                                                                        alt={player.name}
                                                                        className="h-12 w-12 object-contain rounded-full"
                                                                    />
                                                                ) : (
                                                                    <div className="h-12 w-12 flex items-center justify-center">
                                                                        <FontAwesomeIcon
                                                                            icon={faUser}
                                                                            className="text-green-900 text-[2.5rem]"
                                                                        />
                                                                    </div>
                                                                )}
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
                                    <div className="flex mt-1 sm:mt-5">
                                        <button
                                            className="bg-green-800 text-white px-4 py-2 rounded mt-4 mx-auto block hover:bg-green-700"
                                            onClick={handleWalletSummaryPopup}
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
                        )
                    }
                </div >
            </div >

            {
                joinContestLoading ?
                    (<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="w-10 h-10 border-4 border-gray-300 border-t-white rounded-full animate-spin"></div>
                    </div>)
                    :
                    isPopupVisible && (
                        <Popup
                            message={popupMessage}
                            onClose={closePopup}
                        />
                    )
            }
            {
                loading ? (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="w-10 h-10 border-4 border-gray-300 border-t-white rounded-full animate-spin"></div>
                    </div>
                ) :
                    (

                        walletSummaryPopup && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                                <div className="relative bg-white p-8 rounded-xl shadow-2xl sm:w-full w-[90%]  max-w-md">

                                    <button
                                        onClick={closeWalletSummaryPopup}
                                        className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition"
                                    >
                                        <img className="h-5 w-5" src={close} alt="close" />
                                    </button>

                                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 text-center mb-6 border-b pb-4">
                                        Wallet Summary
                                    </h2>

                                    <div className="space-y-4 text-base text-gray-700">
                                        <div className="flex justify-between">
                                            <span className="text-sm sm:text-base font-medium">Current Wallet Balance</span>
                                            <span className="text-green-700 font-semibold">₹{balance}</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-sm sm:text-base font-medium">Contest Entry Fee</span>
                                            <span className="text-red-600 font-semibold">- ₹{contest.entryFee}</span>
                                        </div>

                                        <div className="flex justify-between border-t pt-4 mt-4">
                                            {
                                                remBalance < 0 ?
                                                    <span className="text-red-600 text-sm sm:text-base  font-semibold">Insufficient Balance</span>
                                                    :
                                                    <span className="text-gray-700 text-sm sm:text-base  font-medium">Remaining Balance</span>
                                            }
                                            {/* <span className="font-medium">Remaining Balance</span> */}
                                            {
                                                remBalance < 0 ?
                                                    <span className="text-red-600 font-semibold">₹{Math.abs(remBalance)}</span>
                                                    :
                                                    <span className="text-green-700 font-medium">₹{remBalance}</span>
                                            }

                                        </div>
                                    </div>


                                    {
                                        remBalance < 0 ?
                                            <button
                                                onClick={() => handleAddMoneyPopup()}
                                                className="mt-8 w-full font-bold text-white bg-green-600 py-2 rounded-md hover:bg-green-700 transition"
                                            >
                                                VERIFY TO ADD ₹{Math.abs(remBalance)}
                                            </button>
                                            :
                                            <button
                                                onClick={() => handleJoinContest()}
                                                className="mt-8 w-full font-bold text-white bg-green-600 py-2 rounded-md hover:bg-green-700 transition"
                                            >
                                                Join Contest
                                            </button>
                                    }

                                </div>
                            </div>

                        )
                    )
            }
            <AddMoneyPopup
                ref={popupRef}
                API_URL={API_URL}
                accessToken={accessToken}
                walletBalance={balance}
            />
        </div >
    );
};
export default ContestDetails;
