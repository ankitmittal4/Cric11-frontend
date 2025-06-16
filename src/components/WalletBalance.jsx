// src/components/WalletBalance.js
import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import AddMoneyPopup from './Payment/AddMoneyPopup';
const API_URL = import.meta.env.VITE_API_URL;

const WalletBalance = () => {
    const [balance, setBalance] = useState(0);
    const popupRef = useRef();
    const hasInitialized = useRef(false);
    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;
        const fetchBalance = async () => {
            try {
                const response = await axios.get(`${API_URL}/users/get-balance`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setBalance(response.data.data.walletBalance);
            } catch (error) {
                console.error('Error fetching balance:', error);
            }
        };
        fetchBalance();
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
            />
        </>
    );
};

export default WalletBalance;
