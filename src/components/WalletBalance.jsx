// src/components/WalletBalance.js
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWallet } from "@fortawesome/free-solid-svg-icons";
const WalletBalance = () => {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchBalance = async () => {
      // Simulate API call to fetch balance
      const fetchedBalance = await new Promise((resolve) =>
        setTimeout(() => resolve(1000), 1000)
      );
      setBalance(fetchedBalance);
    };

    fetchBalance();

    // Optional: Set up an interval to periodically update balance
    const interval = setInterval(fetchBalance, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-white ml-16 font-bold">
      <FontAwesomeIcon icon={faWallet} className="text-white text-2xl" /> ₹
      {balance}
    </div>
  );
};

export default WalletBalance;
