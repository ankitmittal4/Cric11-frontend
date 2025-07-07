import React, { useState, useRef, useImperativeHandle, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import close from '../../assets/close.png';
import { add, set } from "date-fns";
import { useFormik } from "formik";
import * as Yup from "yup";
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

const WithdrawMoneyPopup = React.forwardRef(({ API_URL, accessToken, walletBalance, fetchTransactions = () => { }, onMoneyAdded = () => { } }, ref) => {
    const userEmail = localStorage.getItem("email");
    const userName = localStorage.getItem("fullName");

    const [visible, setVisible] = useState(false);

    const inputRef = useRef(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const formik = useFormik({
        initialValues: {
            amount: "",
            upiId: "",
        },
        validationSchema: Yup.object({
            amount: Yup.number()
                .typeError("Amount must be a number")
                .positive("Amount must be greater than 0")
                .required("Amount is required")
                .max(walletBalance, `Amount cannot exceed ₹${walletBalance}`),
            upiId: Yup.string()
                .matches(/^[\w.-]+@[\w.-]+$/, "Invalid UPI ID")
                .required("UPI ID is required"),
        }),
        onSubmit: (values, { setSubmitting }) => {
            handlePayment(values.amount, values.upiId);
            setSubmitting(false);
        },
    });

    useImperativeHandle(ref, () => ({
        show() {
            // setAmount("");
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

    const closePopup = () => {
        setVisible(false);
        formik.resetForm();
    };

    const handlePayment = async (amount, upiId) => {
        setLoading(true);

        const data = {
            name: userName,
            email: userEmail,
            amount: amount,
            upi: upiId,
        }

        try {
            const transaction = await axios.post(`${API_URL}/withdraw/withdraw-money`, data, {
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
                    transactionId: transaction.data.data.transactionId,
                    upiId: upiId,
                });
                console.log("Payment successfull and Confirmation email sent!");
            } catch (error) {
                console.error("Error sending email:", error);
            }
        } catch (err) {
            console.error("payment failure:", err);
        }
        finally {
            setLoading(false);
            setVisible(false);
            formik.resetForm();
        }
    }

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

                    <form onSubmit={formik.handleSubmit} className="mt-6">
                        <div className="text-base text-gray-700 font-semibold mb-4">
                            Amount to withdraw:
                            <div className="relative inline-block mt-1 w-[80%]">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">₹</span>
                                <input
                                    ref={inputRef}
                                    type="number"
                                    name="amount"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.amount}
                                    className={`border rounded pl-6 pr-2 py-1 outline-none w-full ${formik.touched.amount && formik.errors.amount
                                        ? "border-red-500"
                                        : "border-gray-300"
                                        }`}
                                    placeholder="Enter amount"
                                />
                            </div>
                            <p className="text-red-500 text-xs mt-1 min-h-[16px]">
                                {formik.touched.amount && formik.errors.amount ? formik.errors.amount : " "}
                            </p>
                        </div>

                        {/* UPI Input */}
                        <div className="text-base text-gray-700 font-semibold mb-4">
                            Enter UPI ID:
                            <br></br>
                            <div className="relative inline-block mt-1 w-[80%]">
                                <input
                                    type="text"
                                    name="upiId"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.upiId}
                                    className={`border rounded pl-3 pr-4 py-1 outline-none w-full ${formik.touched.upiId && formik.errors.upiId
                                        ? "border-red-500"
                                        : "border-gray-300"
                                        }`}
                                    placeholder="name@bank"
                                />
                            </div>
                            <p className="text-red-500 text-xs mt-1 min-h-[16px]">
                                {formik.touched.upiId && formik.errors.upiId ? formik.errors.upiId : " "}
                            </p>

                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={formik.isSubmitting}
                            className={`mt-5 sm:mt-2 w-full font-bold text-sm px-4 py-2 rounded bg-green-600 text-white ${formik.isSubmitting ? "cursor-not-allowed opacity-70" : "hover:bg-green-700"
                                }`}
                        >
                            {formik.isSubmitting ? "Processing..." : `VERIFY TO WITHDRAW ₹${formik.values.amount || 0}`}
                        </button>
                    </form>
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
