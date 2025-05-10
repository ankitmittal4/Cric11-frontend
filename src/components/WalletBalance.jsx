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
    const accessToken = localStorage.getItem('accessToken');
    useEffect(() => {
        const fetchBalance = async () => {
            // Simulate API call to fetch balance
            const response = await axios.get(`${API_URL}/users/get-balance`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setBalance(response.data.data.walletBalance);
        };

        fetchBalance();

        // Optional: Set up an interval to periodically update balance
        const interval = setInterval(fetchBalance, 5000);

        return () => clearInterval(interval);
    }, []);
    const openAddMoneyPopup = () => {
        popupRef.current?.show();
    };

    return (
        <>

            <div className="text-white ml-16 font-bold cursor-pointer" onClick={() => openAddMoneyPopup()}>
                <FontAwesomeIcon
                    icon={faWallet}
                    className="text-white text-2xl"
                />{' '}
                <span className="">₹{balance}</span>
            </div>
            <AddMoneyPopup
                ref={popupRef}
                API_URL={API_URL}
                accessToken={accessToken}
                walletBalance={balance}
            // fetchTransactions={fetchTransactions}
            />
        </>
    );
};

export default WalletBalance;
