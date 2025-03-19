// src/components/WalletBalance.js
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { API_URL } from '../../Constants';

const WalletBalance = () => {
    const [balance, setBalance] = useState(0);
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

    return (
        <div className="text-white ml-16 font-bold">
            <FontAwesomeIcon
                icon={faWallet}
                className="text-white text-2xl"
            />{' '}
            <span className="">₹{balance}</span>
        </div>
    );
};

export default WalletBalance;
