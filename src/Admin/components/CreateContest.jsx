import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import Popup from '../../features/Popup';
const API_URL = import.meta.env.VITE_API_URL;

const CreateContest = () => {
    const { matchId } = useParams();
    const location = useLocation();
    // console.log("Location", location);
    const { t1, t2, t1img, t2img, series } = location.state;
    const [entryFee, setEntryFee] = useState('');
    const [prizePool, setPrizePool] = useState('');
    const [totalSpots, setTotalSpots] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Reset error message
        setErrorMessage('');

        if (entryFee <= 0 || prizePool <= 0 || prizePool <= entryFee || prizePool > entryFee * 2) {
            setErrorMessage('Entry Fee and Prize Pool must be valid numbers.');
            setLoading(false);
            return;
        }

        const contestData = {
            matchId,
            entryFee,
            prizePool,
            maxParticipants: totalSpots || '2',
            t1,
            t2,
            t1img,
            t2img,
            series,
        };

        try {
            const response = await axios.post(
                `${API_URL}/contests/create`,
                contestData,
            );
            setLoading(false);
            if (response.data.statusCode === 200) {
                setPopupMessage('Contest Created Successfully!');
                setIsPopupVisible(true);
            }
        } catch (error) {
            // console.log("create error: ", error);
            setErrorMessage(
                error.response?.data?.message || 'Failed to create contest',
            );
            alert(error.response?.data?.message);
            navigate('/admin/dashboard/matches');
        }
    };
    const closePopup = () => {
        setIsPopupVisible(false); // Hide the popup
        navigate('/admin/dashboard/contests');
    };

    return (
        <>
            {loading && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                    <FontAwesomeIcon
                        icon={faSpinner}
                        spin
                        className="text-white text-4xl"
                    />
                </div>
            )}
            <div className="p-6 bg-gray-800 text-white rounded-md shadow-md">
                <h1 className="text-2xl mb-5 text-red">
                    Create Contest for Match:
                    <span className="text-green-500 text-3xl">
                        {' '}
                        {t1} <span className="text-white">vs</span> {t2}
                    </span>
                </h1>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    <div>
                        <label
                            className="block mb-1"
                            htmlFor="entryFee"
                        >
                            Entry Fee:
                        </label>
                        <input
                            type="number"
                            id="entryFee"
                            value={entryFee}
                            onChange={(e) => setEntryFee(e.target.value)}
                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label
                            className="block mb-1"
                            htmlFor="prizePool"
                        >
                            Prize Pool:
                        </label>
                        <input
                            type="number"
                            id="prizePool"
                            value={prizePool}
                            onChange={(e) => setPrizePool(e.target.value)}
                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md"
                            required
                        />
                    </div>
                    {/* <div>
                        <label
                            className="block mb-1"
                            htmlFor="totalSpots"
                        >
                            Total Spots:
                        </label>
                        <input
                            type="number"
                            id="totalSpots"
                            value={totalSpots}
                            onChange={(e) => setTotalSpots(e.target.value)}
                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md"
                            required
                        />
                    </div>
                    */}
                    {errorMessage && (
                        <div className="text-red-500">{errorMessage}</div>
                    )}
                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
                    >
                        Create Contest
                    </button>
                </form>
            </div>
            {isPopupVisible && (
                <Popup
                    message={popupMessage}
                    onClose={closePopup}
                />
            )}
        </>
    );
};

export default CreateContest;
