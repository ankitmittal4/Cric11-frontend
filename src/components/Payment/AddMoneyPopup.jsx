import React, { useState, useRef, useImperativeHandle } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import close from '../../assets/close.png';
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

const AddMoneyPopup = React.forwardRef(({ API_URL, accessToken, walletBalance, fetchTransactions = () => { } }, ref) => {
    const [visible, setVisible] = useState(false);
    const [amount, setAmount] = useState("");
    const inputRef = useRef(null);

    const isDisabled = !amount || Number(amount) <= 0;

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
        }
    }));

    const closePopup = () => setVisible(false);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async (amount) => {
        const res = await loadRazorpayScript();
        if (!res) {
            alert("Razorpay SDK failed to load");
            return;
        }

        const response = await axios.post(`${API_URL}/payment/create-order`, { amount }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const { order } = response.data;
        setVisible(false);

        const options = {
            key: RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: "Cric 11",
            description: "Add money to wallet",
            order_id: order.id,
            prefill: {
                name: "John Doe",
                email: "john@example.com",
                contact: "9999999999",
            },
            theme: {
                color: "#528ff0",
            },
            handler: async (response) => {
                try {
                    await axios.post(`${API_URL}/payment/verify`, {
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                        amount,
                    }, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });

                    alert("Payment Successful & Verified ✅");
                    fetchTransactions();
                } catch (err) {
                    alert("Payment succeeded, but verification failed ❌");
                    console.error(err);
                }
            },
        };
        const rzp = new window.Razorpay(options);
        let failureHandled = false;
        rzp.on('payment.failed', async function (response) {

            if (failureHandled) return;
            failureHandled = true;
            const failureData = {
                code: response.error.code,
                description: response.error.description,
                source: response.error.source,
                reason: response.error.reason,
                order_id: response.error.metadata.order_id,
                payment_id: response.error.metadata.payment_id,
                amount,
            };

            try {
                await axios.post(`${API_URL}/payment/failed`, failureData, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                // console.log("Payment failure logged successfully");
                fetchTransactions();
            } catch (err) {
                console.error("Failed to report payment failure:", err);
            }
        });
        rzp.open();
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handlePayment(amount);
    };

    if (!visible) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="relative bg-white p-6 rounded-lg shadow-lg pl-9 pr-9 min-w-[23%]">
                <button
                    onClick={closePopup}
                    className="absolute top-2 right-2 text-red-500 px-1 py-1 text-md font-bold rounded hover:text-red-600"
                >
                    <img className="h-5 w-5" src={close} alt="close" />
                </button>

                <p className="text-lg text-gray-700 font-semibold">
                    Current Balance: ₹{walletBalance}
                </p>

                <p className="text-lg text-gray-700 font-semibold mt-8">
                    Amount to add:
                    <div className="relative inline-block ml-1">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">₹</span>
                        <input
                            ref={inputRef}
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="border border-gray-300 rounded pl-6 pr-2 py-1 outline-none"
                            placeholder="Enter amount"
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                </p>

                <button
                    onClick={() => handlePayment(amount)}
                    disabled={isDisabled}
                    className={`mt-10 w-full font-bold text-sm px-4 py-2 rounded bg-green-600 text-white ${isDisabled ? "cursor-not-allowed" : " hover:bg-green-700"
                        }`}
                >
                    VERIFY TO ADD ₹{amount || 0}
                </button>
            </div>
        </div>
    );
});


AddMoneyPopup.displayName = "AddMoneyPopup";


AddMoneyPopup.propTypes = {
    API_URL: PropTypes.string.isRequired,
    accessToken: PropTypes.string.isRequired,
    walletBalance: PropTypes.number.isRequired,
    fetchTransactions: PropTypes.func,
};

export default AddMoneyPopup;
