import React, { useEffect, useState } from "react";
import axios from "axios";

const Transactions = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-700">
        Wallet Balance: <span className="text-green-700 text-3xl">{1000}</span>
      </h1>
      <h1 className="text-2xl font-bold mb-4">All Transactions:</h1>
      <p>List of transactions...</p>
    </div>
  );
};

export default Transactions;
