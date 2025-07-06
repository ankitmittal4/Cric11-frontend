import React, { useState, useRef, useImperativeHandle } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import close from '../../assets/close.png';
import { add, set } from "date-fns";
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

const WithdrawMoneyPopup = React.forwardRef(({ API_URL, accessToken, walletBalance, fetchTransactions = () => { }, onMoneyAdded = () => { } }, ref) => {
    const userEmail = localStorage.getItem("email");
    const userName = localStorage.getItem("fullName");

    const [visible, setVisible] = useState(false);
    const [amount, setAmount] = useState("");
    const inputRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const isDisabled = !amount || Number(amount) <= 0 || walletBalance < Number(amount);

    useImperativeHandle(ref, () => ({
        show() {
            setAmount("");
            setVisible(true);
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        },
        hide() {
            setVisible(false);
        },
        paymentFunction(addAmount) {
            handlePayment(addAmount);
        }
    }));

    const closePopup = () => setVisible(false);

    const handlePayment = async (amount) => {
        setLoading(true);

        try {
            const transaction = await axios.post(`${API_URL}/withdraw/withdraw-money`, { amount }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setLoading(false);
            setVisible(false);
            window.dispatchEvent(new CustomEvent('updateBalance'));
            fetchTransactions();
            try {
                await axios.post(`${API_URL}/email/payment-withdraw-success`, {
                    email: userEmail,
                    name: userName,
                    amount: amount,
                    transactionId: transaction.data.data._id,
                });
                console.log("Payment successfull and Confirmation email sent!");
            } catch (error) {
                console.error("Error sending email:", error);
            }
        } catch (err) {
            console.error("payment failure:", err);
        }
        finally {
            // setTimeout(() => {
            setLoading(false);
            setVisible(false);
            // }, 1);
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handlePayment(amount);
    };

    if (!visible) return null;

    return (
        <>
            <div
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                onClick={closePopup}
            >
                <div className="relative bg-white p-6 rounded-lg shadow-lg pl-9 pr-9 sm:min-w-[23%] sm:w-[27%] w-[90%]"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={closePopup}
                        className="absolute top-2 right-2 text-red-500 px-1 py-1 text-md font-bold rounded hover:text-red-600"
                    >
                        <img className="h-5 w-5" src={close} alt="close" />
                    </button>

                    <p className="text-base sm:text-lg text-gray-700 font-semibold">
                        Current Balance: ₹{walletBalance}
                    </p>

                    <div className="text-base sm:text-lg text-gray-700 font-semibold mt-8">
                        Amount to withdraw:
                        <div className="relative inline-block ">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">₹</span>
                            <input
                                ref={inputRef}
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="border border-gray-300 rounded pl-6 pr-2 py-1 outline-none w-[100%]"
                                placeholder="Enter amount"
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                    </div>

                    <button
                        onClick={() => handlePayment(amount)}
                        disabled={isDisabled}
                        className={`mt-5 sm:mt-7 w-full font-bold text-sm px-4 py-2 rounded bg-green-600 text-white ${isDisabled ? "cursor-not-allowed" : "hover:bg-green-700"
                            }`}
                    >
                        VERIFY TO WITHDRAW ₹{amount || 0}
                    </button>
                </div>
            </div >

            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="w-10 h-10 border-4 border-gray-300 border-t-white rounded-full animate-spin"></div>
                </div>
            )
            }
        </>
    );
});


WithdrawMoneyPopup.displayName = "WithdrawMoneyPopup";


WithdrawMoneyPopup.propTypes = {
    API_URL: PropTypes.string.isRequired,
    accessToken: PropTypes.string.isRequired,
    walletBalance: PropTypes.number.isRequired,
    fetchTransactions: PropTypes.func,
    onMoneyAdded: PropTypes.func,
};

export default WithdrawMoneyPopup;
