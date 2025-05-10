import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;
import PropTypes from 'prop-types';
import { format, toZonedTime } from 'date-fns-tz';
import AddMoneyPopup from './Payment/AddMoneyPopup';


const Transactions = () => {
    const popupRef = useRef();
    const accessToken = localStorage.getItem('accessToken');
    const [transactions, setTransactions] = useState([]);
    const [walletBalance, setWalletBalance] = useState(0); // Example wallet balance
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1)
    const limit = 10


    // Fetch transactions from API
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

            const totalTransactions = reversedTransactions.length;
            const startIndex = (currentPage - 1) * limit;
            const endIndex = startIndex + limit;
            const paginateTransactions = reversedTransactions.slice(startIndex, endIndex);
            // console.log(currentPage);
            // setTransactions(reversedTransactions);
            setTransactions(paginateTransactions);
            setTotalPages(Math.ceil(totalTransactions / limit));
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };
    useEffect(() => {
        fetchTransactions();
    }, [currentPage]);

    const handlePageChange = (page) => {
        window.scrollTo(0, 0);
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const openAddMoneyPopup = () => {
        popupRef.current?.show();
    };

    return (
        <div className="container mx-auto p-4">
            {/* Wallet Balance */}
            <div className="relative flex justify-center items-center mb-4">
                <div className="text-2xl font-bold text-gray-700 text-center">
                    Wallet Balance:{' '}
                    <span className="text-green-700 text-3xl">
                        ₹{walletBalance}
                    </span>
                </div>
                <button className="absolute right-0 text-white bg-red-600 px-5 py-2 rounded-md whitespace-nowrap hover:bg-red-700" onClick={() => openAddMoneyPopup()}>
                    Add money to wallet
                </button>
            </div>

            <h1 className="text-2xl font-bold mb-4">All Transactions:</h1>
            {transactions.length > 0 ? (
                <>
                    <div className="space-y-3">
                        {transactions.map((transaction) => (
                            <TransactionCard
                                key={transaction._id}
                                transaction={transaction}
                            />
                        ))}
                    </div>

                    <div className="flex justify-between items-center mt-5">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 ml-10 mb-8 mt-6 text-white bg-gray-500 rounded disabled:opacity-60"
                        >
                            Back
                        </button>
                        <span className="text-black">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 mr-10 mb-8 mt-6 bg-gray-500 text-white rounded disabled:opacity-60"
                        >
                            Next
                        </button>
                    </div>
                </>
            ) : (
                <p className="text-gray-500 text-center">No transactions found.</p>
            )}

            <AddMoneyPopup
                ref={popupRef}
                API_URL={API_URL}
                accessToken={accessToken}
                walletBalance={walletBalance}
                fetchTransactions={fetchTransactions}
            />
        </div >
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
    const capitaliseFirstLetter = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    return (
        <div className="bg-slate-100 p-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
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
                    <p className="text-lg font-semibold">
                        <span
                            className={
                                transactionType === 'credit'
                                    ? 'text-green-600'
                                    : 'text-red-600'
                            }
                        >
                            {capitaliseFirstLetter(transactionType)}
                        </span>
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-gray-600 text-sm">{formattedDate}</p>
                    <p className="text-gray-600 text-sm">{formattedTime}</p>
                    <p
                        className={`text-sm font-semibold ${transactionStatus === 'success'
                            ? 'text-green-600'
                            : transactionStatus === 'pending'
                                ? 'text-yellow-600'
                                : 'text-red-600'
                            }`}
                    >
                        {capitaliseFirstLetter(transactionStatus)}
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
