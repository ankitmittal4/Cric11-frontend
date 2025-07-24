import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;
import PropTypes from 'prop-types';
import { format, toZonedTime } from 'date-fns-tz';
import AddMoneyPopup from './AddMoneyPopup';
import WithdrawMoneyPopup from './WithrawMoneyPopup';

const Transactions = () => {
    const addMoneyRef = useRef();
    const withdrawMoneyRef = useRef();
    const accessToken = localStorage.getItem('accessToken');
    const [transactions, setTransactions] = useState([]);
    const [walletBalance, setWalletBalance] = useState(0); // Example wallet balance
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const limit = 10

    const fetchTransactions = async () => {

        setLoading(true);
        try {
            const data = {
                page: currentPage,
                limit: limit,
            }
            const response = await axios.post(
                `${API_URL}/transactions/all`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                },
            );
            setWalletBalance(response.data.data.walletBalance);
            const startIndex = (response.data.data.pagination.page - 1) * limit;
            const endIndex = startIndex + limit;
            setTransactions(response.data.data.transactions);
            setTotalPages(response.data.data.pagination.totalPages);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchTransactions();
        const handleMoneyAdded = () => {
            fetchTransactions();
        };

        window.addEventListener('moneyAdded', handleMoneyAdded);

        return () => {
            window.removeEventListener('moneyAdded', handleMoneyAdded);
        };
    }, [currentPage]);

    const handlePageChange = (page) => {
        window.scrollTo(0, 0);
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const openAddMoneyPopup = () => {
        addMoneyRef.current?.show();
    };
    const openWithdrawMoneyPopup = () => {
        withdrawMoneyRef.current?.show();
    };

    return (

        <div className="container mx-auto p-4">
            {/* Wallet Balance */}
            <div className="relative flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-0 mb-4">
                <div className="text-xl sm:text-2xl font-bold text-gray-700 text-center">
                    Wallet Balance:{' '}
                    <span className="text-green-700 text-2xl sm:text-3xl">
                        ₹{walletBalance}
                    </span>
                </div>
                <button
                    className="sm:absolute sm:right-0 text-white bg-red-600 px-4 py-2 rounded-md whitespace-nowrap hover:bg-red-700 text-sm sm:text-base  sm:w-auto"
                    onClick={() => openAddMoneyPopup()}
                >
                    Add Money to Wallet
                </button>
                <button
                    className="sm:absolute sm:right-[12rem] text-white bg-red-600 px-4 py-2 rounded-md whitespace-nowrap hover:bg-red-700 text-sm sm:text-base  sm:w-auto"
                    onClick={() => openWithdrawMoneyPopup()}
                >
                    Withdraw Money
                </button>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold mb-4">All Transactions:</h1>

            {loading ? (
                <div>
                    {[...Array(4)].map((_, index) => (
                        <div key={index} className="bg-slate-100 p-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-shadow mb-2 animate-pulse">
                            <div className="flex justify-between items-start gap-4">

                                <div className="flex flex-col space-y-2">
                                    <div className="h-5 w-24 bg-gray-300 rounded mb-3"></div>
                                    <div className="h-4 w-40 bg-gray-300 rounded"></div>
                                </div>

                                {/* Right section: Message, Date, Time */}
                                <div className="flex flex-col items-end space-y-2 text-right">
                                    <div className="h-4 w-32 bg-gray-300 rounded"></div>
                                    <div className="h-4 w-24 bg-gray-300 rounded"></div>
                                    <div className="h-4 w-16 bg-gray-300 rounded"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : transactions.length > 0 ? (
                <>
                    <div className="sm:space-y-3">
                        {transactions.map((transaction) => (
                            <TransactionCard key={transaction._id} transaction={transaction} />
                        ))}
                    </div>

                    <div className="grid grid-cols-3 items-center gap-2 mt-6 w-full">
                        <div className="flex justify-start">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 text-white bg-gray-500 rounded disabled:opacity-60"
                            >
                                Back
                            </button>
                        </div>

                        <div className="flex justify-center text-black text-center">
                            Page {currentPage} of {totalPages}
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 text-white bg-gray-500 rounded disabled:opacity-60"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <p className="text-gray-500 text-center">No transactions found.</p>
            )}

            <AddMoneyPopup
                ref={addMoneyRef}
                API_URL={API_URL}
                accessToken={accessToken}
                walletBalance={walletBalance}
                fetchTransactions={fetchTransactions}
            />
            <WithdrawMoneyPopup
                ref={withdrawMoneyRef}
                API_URL={API_URL}
                accessToken={accessToken}
                walletBalance={walletBalance}
                fetchTransactions={fetchTransactions}
            />


        </div>

    );
};


// Transaction Card Component
const TransactionCard = ({ transaction }) => {
    const { _id, amount, transactionId, transactionType, transactionStatus, message, createdAt } =
        transaction;
    const istDate = toZonedTime(createdAt, 'Asia/Kolkata');
    const formattedDate = format(istDate, 'dd-MM-yyyy', {
        timeZone: 'Asia/Kolkata',
    });
    const formattedTime = format(istDate, 'hh:mm a', {
        timeZone: 'Asia/Kolkata',
    });
    const capitaliseFirstLetter = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    return (
        <div className="bg-slate-100 p-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-shadow mb-2">
            <div className="flex justify-between items-start gap-4">
                {/* Left section: Amount, Status, Transaction ID */}
                <div className="flex flex-col">
                    <p className="text-lg font-semibold">
                        <span
                            className={
                                transactionType === 'credit' || transactionType === 'refund'
                                    ? 'text-green-600'
                                    : transactionType === 'nothing'
                                        ? 'text-gray-500 line-through'
                                        : 'text-red-600'
                            }
                        >
                            {transactionType === 'credit' || transactionType === 'refund' ? '+' : transactionType === 'debit' ? '-' : ''}{' '}
                            ₹{amount}
                        </span>
                    </p>

                    <p
                        className={`text-md font-semibold h-6 ${transactionStatus === 'success'
                            ? 'text-green-600'
                            : transactionStatus === 'pending'
                                ? 'text-yellow-600'
                                : 'text-red-600'
                            }`}
                    >
                        {transactionStatus === 'failed' && capitaliseFirstLetter(transactionStatus)}
                    </p>

                    <p className="text-gray-600 sm:text-sm text-xs">
                        <span className='hidden sm:inline'>Transaction Id: </span>
                        {/* {(transactionId || _id).slice(0, 12)} */}
                        {_id}
                    </p>
                </div>

                {/* Right section: Message, Date, Time aligned to right of amount */}
                <div className="flex flex-col items-end text-right sm:text-sm text-xs">
                    <p className="text-gray-700 mb-1">{message}</p>
                    <p className="text-gray-600 text-xs sm:text-sm">{formattedDate}</p>
                    <p className="text-gray-600 text-xs sm:text-sm">{formattedTime}</p>
                </div>
            </div>
        </div>
    );
};

TransactionCard.propTypes = {
    transaction: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        transactionId: PropTypes.string,
        amount: PropTypes.number.isRequired,
        transactionType: PropTypes.oneOf(['credit', 'debit', 'nothing']).isRequired,
        message: PropTypes.string,
        transactionStatus: PropTypes.oneOf(['success', 'failed', 'pending'])
            .isRequired,
        createdAt: PropTypes.string.isRequired,
    }).isRequired,
};

export default Transactions;


{/* {transactions.length > 0 ? (
                <>
                    <div className="sm:space-y-3">
                        {transactions.map((transaction) => (
                            <TransactionCard key={transaction._id} transaction={transaction} />
                        ))}
                    </div>

                    <div className="grid grid-cols-3 items-center gap-2 mt-6 w-full">
                        <div className="flex justify-start">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 text-white bg-gray-500 rounded disabled:opacity-60"
                            >
                                Back
                            </button>
                        </div>

                        <div className="flex justify-center text-black text-center">
                            Page {currentPage} of {totalPages}
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 text-white bg-gray-500 rounded disabled:opacity-60"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <p className="text-gray-500 text-center">No transactions found.</p>
            )} */}