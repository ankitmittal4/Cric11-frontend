import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../Constants';
import PropTypes from 'prop-types';
import { format, toZonedTime } from 'date-fns-tz';

const Transactions = () => {
    const accessToken = localStorage.getItem('accessToken');
    const [transactions, setTransactions] = useState([]);
    const [walletBalance, setWalletBalance] = useState(0); // Example wallet balance

    // Fetch transactions from API
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get(
                    `${API_URL}/transactions/all`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    },
                );
                // console.log(
                //     'Transaction response: ',
                //     response.data.data.walletBalance,
                // );
                setWalletBalance(response.data.data.walletBalance);

                const reversedTransactions = [
                    ...response.data.data.transactions,
                ].reverse();
                setTransactions(reversedTransactions);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, []);

    return (
        <div className="container mx-auto p-4">
            {/* Wallet Balance */}
            <h1 className="text-2xl font-bold mb-4 text-center text-gray-700">
                Wallet Balance:{' '}
                <span className="text-green-700 text-3xl">
                    ₹{walletBalance}
                </span>
            </h1>

            {/* Transactions List */}
            <h1 className="text-2xl font-bold mb-4">All Transactions:</h1>
            <div className="space-y-4">
                {transactions.length > 0 ? (
                    transactions.map((transaction) => (
                        <TransactionCard
                            key={transaction._id}
                            transaction={transaction}
                        />
                    ))
                ) : (
                    <p className="text-gray-500 text-center">
                        No transactions found.
                    </p>
                )}
            </div>
        </div>
    );
};

// Transaction Card Component
const TransactionCard = ({ transaction }) => {
    const { _id, amount, transactionType, transactionStatus, createdAt } =
        transaction;
    const istDate = toZonedTime(createdAt, 'Asia/Kolkata');
    const formattedDate = format(istDate, 'dd/MM/yyyy', {
        timeZone: 'Asia/Kolkata',
    });
    const formattedTime = format(istDate, 'hh:mm:ss a', {
        timeZone: 'Asia/Kolkata',
    });

    return (
        <div className="bg-slate-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-gray-600 text-sm">
                        Transaction ID: {_id}
                    </p>
                    <p className="text-lg font-semibold">
                        Amount:{' '}
                        <span
                            className={
                                transactionType === 'credit'
                                    ? 'text-green-600'
                                    : 'text-red-600'
                            }
                        >
                            ₹{amount}
                        </span>
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-gray-600 text-sm">{formattedDate}</p>
                    <p className="text-gray-600 text-sm">{formattedTime}</p>
                    <p
                        className={`text-sm font-semibold ${
                            transactionStatus === 'success'
                                ? 'text-green-600'
                                : transactionStatus === 'pending'
                                ? 'text-yellow-600'
                                : 'text-red-600'
                        }`}
                    >
                        {transactionStatus}
                    </p>
                </div>
            </div>
        </div>
    );
};

TransactionCard.propTypes = {
    transaction: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired,
        transactionType: PropTypes.oneOf(['Deposit', 'Withdraw']).isRequired,
        transactionStatus: PropTypes.oneOf(['Success', 'Failed', 'Pending'])
            .isRequired,
        createdAt: PropTypes.string.isRequired,
    }).isRequired,
};

export default Transactions;
