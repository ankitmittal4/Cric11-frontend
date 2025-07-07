import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import AddMoneyPopup from './AddMoneyPopup';
const API_URL = import.meta.env.VITE_API_URL;

const WalletBalance = () => {
    const [balance, setBalance] = useState(0);
    const popupRef = useRef();
    const hasInitialized = useRef(false);
    const accessToken = localStorage.getItem('accessToken');

    const fetchBalance = async () => {
        // console.log("Money added");
        try {
            const response = await axios.get(`${API_URL}/users/get-balance`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setBalance(response.data.data.walletBalance);
            // setBalance(1000); // Mock balance for testing
        } catch (error) {
            console.error('Error fetching balance:', error);
        }
    };
    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;
        fetchBalance();
        const handleUpdateBalance = () => {
            // console.log("Update Balance in navbar event received");
            fetchBalance();
        };
        window.addEventListener('updateBalance', handleUpdateBalance);
        return () => {
            window.removeEventListener('updateBalance', handleUpdateBalance);
        };
    }, []);
    const openAddMoneyPopup = () => {
        popupRef.current?.show();
    };

    return (
        <>

            <div className="text-white ml-4 font-bold cursor-pointer" onClick={() => openAddMoneyPopup()}>
                <FontAwesomeIcon
                    icon={faWallet}
                    className="text-white text-2xl sm:h-6 sm:w-6 h-5 w-5"
                />{' '}
                <span className="">₹{balance}</span>
            </div>
            <AddMoneyPopup
                ref={popupRef}
                API_URL={API_URL}
                accessToken={accessToken}
                walletBalance={balance}
                onMoneyAdded={fetchBalance}
            />
        </>
    );
};

export default WalletBalance;
