import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [walletBalance, setWalletBalance] = useState(1000); // Example wallet balance

    // Fetch transactions from API
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                // const response = await axios.get(
                //     'https://api.example.com/transactions',
                // );
                // id, amount, type, date, status
                const response = [
                    {
                        id: 12391,
                        amount: 2122,
                        type: 'Debit',
                        date: '1-2-2003',
                        status: 'success',
                    },
                    {
                        id: 12391,
                        amount: 2122,
                        type: 'credit',
                        date: '1-2-2003',
                        status: 'failed',
                    },
                    {
                        id: 12391,
                        amount: 2122,
                        type: 'Debit',
                        date: '1-2-2003',
                        status: 'pending',
                    },
                    {
                        id: 12391,
                        amount: 2122,
                        type: 'Debit',
                        date: '1-2-2003',
                        status: 'success',
                    },
                    {
                        id: 12391,
                        amount: 2122,
                        type: 'Debit',
                        date: '1-2-2003',
                        status: 'success',
                    },
                ];
                setTransactions(response);
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
                            key={transaction.id}
                            transaction={transaction}
                        />
                    ))
                ) : (
                    <p className="text-gray-500">No transactions found.</p>
                )}
            </div>
        </div>
    );
};

// Transaction Card Component
const TransactionCard = ({ transaction }) => {
    const { id, amount, type, date, status } = transaction;

    return (
        <div className="bg-slate-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-gray-600 text-sm">
                        Transaction ID: {id}
                    </p>
                    <p className="text-lg font-semibold">
                        Amount:{' '}
                        <span
                            className={
                                type === 'credit'
                                    ? 'text-green-600'
                                    : 'text-red-600'
                            }
                        >
                            ₹{amount}
                        </span>
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-gray-600 text-sm">{date}</p>
                    <p
                        className={`text-sm font-semibold ${
                            status === 'success'
                                ? 'text-green-600'
                                : status === 'pending'
                                ? 'text-yellow-600'
                                : 'text-red-600'
                        }`}
                    >
                        {status}
                    </p>
                </div>
            </div>
        </div>
    );
};
TransactionCard.propTypes = {
    transaction: PropTypes.shape({
        id: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired,
        type: PropTypes.oneOf(['credit', 'debit']).isRequired,
        date: PropTypes.string.isRequired,
        status: PropTypes.oneOf(['success', 'failed', 'pending']).isRequired,
    }).isRequired,
};

export default Transactions;
