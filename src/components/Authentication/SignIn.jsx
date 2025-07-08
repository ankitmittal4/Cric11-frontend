import React, { useEffect, useState, useRef } from 'react';
import {
    Link,
    unstable_HistoryRouter,
    useNavigate,
    useLocation,
} from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import frameBg from '../../assets/frameBg.png';
import axios from 'axios';
import logo from "../../assets/logo.png"
import { set } from 'date-fns';
const API_URL = import.meta.env.VITE_API_URL;

const SignIn = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showOtpPage, setShowOtpPage] = useState(false);
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [otpError, setOtpError] = useState('');
    const otpRefs = useRef([]);

    useEffect(() => {
        if (localStorage.getItem('accessToken')) {
            navigate('/');
        }
    }, []);

    const RESEND_INTERVAL = 119;
    const [counter, setCounter] = useState(RESEND_INTERVAL);
    const [isResendVisible, setIsResendVisible] = useState(false);
    useEffect(() => {
        let timer;
        if (counter > 0) {
            setIsResendVisible(false);
            timer = setTimeout(() => {
                setCounter((prev) => prev - 1);
            }, 1000);
        } else {
            setIsResendVisible(true);
        }
        return () => clearTimeout(timer);
    }, [counter]);

    const formatTime = (seconds) => {
        const min = String(Math.floor(seconds / 60)).padStart(2, '0');
        const sec = String(seconds % 60).padStart(2, '0');
        return `${min}:${sec}`;
    };

    if (otpRefs.current.length !== 4) {
        otpRefs.current = Array(4)
            .fill()
            .map((_, i) => otpRefs.current[i] || React.createRef());
    }

    useEffect(() => {
        if (showOtpPage && otpRefs.current[0]) {
            otpRefs.current[0].focus();
        }
    }, [showOtpPage]);


    const loginSchema = Yup.object({
        email: Yup.string()
            .email('Invalid email')
            // .matches(
            //     /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
            //     'Only Gmail addresses are allowed',
            // )
            .required('Email is required'),
        password: Yup.string().required('Password is required'),
    });

    const {
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        setValues,
    } = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema: loginSchema,

        onSubmit: async (values, action) => {
            setLoading(true);
            const data = {
                email: values.email,
                password: values.password,
            };
            // console.log('Data: ', data);
            try {
                const res = await axios.post(`${API_URL}/users/login-otp`, data);
                setShowOtpPage(true);
                setCounter(RESEND_INTERVAL);
            } catch (error) {
                console.error('Login failed:', error);
                action.setErrors({
                    submit: error.response?.data?.message || 'Login failed',
                });
            } finally {
                setLoading(false);
                action.setSubmitting(false);
            }
        },
    });

    const handleOtpInput = (e, index) => {
        const value = e.target.value.replace(/[^0-9]/g, ""); // Only digits
        if (!value) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next
        const nextInput = e.target.nextSibling;
        if (nextInput) nextInput.focus();
        // otpRefs.current[index + 1]?.focus();
    };

    const handleBackspace = (e, index) => {
        if (e.key === "Backspace") {
            if (otp[index]) {
                // Just clear current input
                const updatedOtp = [...otp];
                updatedOtp[index] = "";
                setOtp(updatedOtp);
            } else if (index > 0) {
                // Move focus to previous and clear it
                otpRefs.current[index - 1].focus();
                const updatedOtp = [...otp];
                updatedOtp[index - 1] = "";
                setOtp(updatedOtp);
            }
        }
    };


    const handleOtpVerify = async (e) => {
        // setLoading(true);
        const code = otp.join("");
        if (code.length !== 4) {
            setOtpError("Please enter all 4 digits");
            setTimeout(() => {
                setOtpError('');
            }, 3 * 1000);
            return;
        }
        try {
            const res = await axios.post(`${API_URL}/users/verify-otp`, {
                email: values.email,
                otp: code,
            });
            navigate('/');
            setOtpError('')
            setOtp(["", "", "", ""]);

            localStorage.setItem('accessToken', res.data.data.accessToken);
            localStorage.setItem('email', res.data.data.user.email);
            localStorage.setItem('fullName', res.data.data.user.fullName);

            try {
                // const time = new Date().toLocaleString();
                await axios.post(`${API_URL}/email/login`, {
                    email: res.data.data.user.email,
                    name: res.data.data.user.fullName,
                    time: new Date().toLocaleString(),
                });
                console.log("Login successfull and Confirmation email sent!");
            } catch (error) {
                console.error("Error sending email:", error);
            }
            useFormik.action.resetForm();
            setShowOtpPage(false);
        } catch (err) {
            setOtpError(err.response?.data?.message || "OTP verification failed");
            setTimeout(() => {
                setOtpError('');
            }, 3 * 1000)
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setOtp(["", "", "", ""])
        setOtpError('')
        setLoading(true);
        const data = {
            email: values.email,
        };
        // console.log('Data: ', data);
        try {
            const res = await axios.post(`${API_URL}/users/resend-login-otp`, data);
            // console.log(res.message);
            setLoading(false);
            setCounter(RESEND_INTERVAL);
        } catch (err) {
            setOtpError("Failed to resend OTP");
        }
        finally {
            setLoading(false);
        }
    };


    return (
        <div className="relative">

            {showOtpPage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-lg px-6 py-10 relative">
                        <button
                            className="absolute top-2 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold"
                            onClick={() => {
                                setShowOtpPage(false)
                                setOtp(["", "", "", ""])
                                setOtpError('')
                            }
                            }
                        >
                            &times;
                        </button>

                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                            Email Verification
                        </h2>
                        <p className="text-sm text-gray-600 text-center mb-7">
                            Enter the 4-digit verification code that was sent to {values.email}
                        </p>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleOtpVerify();
                        }}>
                            <div className="flex justify-center gap-5 mb-6">
                                {[0, 1, 2, 3].map((index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (otpRefs.current[index] = el)}
                                        type="text"
                                        maxLength="1"
                                        className="w-14 h-14 text-center border border-gray-300 rounded-md text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={otp[index] || ""}
                                        onChange={(e) => handleOtpInput(e, index)}
                                        onKeyDown={(e) => handleBackspace(e, index)}
                                    />
                                ))}
                            </div>

                            <button
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md"
                                type='submit'
                            >
                                Verify Account
                            </button>

                        </form>
                        <div className="text-center text-sm text-gray-600 mt-4">
                            {!isResendVisible ? (
                                <p>
                                    Didn’t receive code?{' '}
                                    <span className="text-blue-500">Resend in {formatTime(counter)}</span>
                                </p>
                            ) : (
                                <p>
                                    Didn’t receive code?{' '}
                                    <button
                                        onClick={handleResendOtp}
                                        className="text-blue-600 font-medium hover:underline"
                                    >
                                        Resend
                                    </button>
                                </p>
                            )}
                        </div>

                        <p className="text-center text-sm text-red-500 mt-3 min-h-[19px]">
                            {otpError && (
                                <p>{otpError}</p>
                            )}
                        </p>
                    </div>
                </div>

            )
            }

            <div
                className="flex min-h-screen bg-cover bg-center px-4 py-8 sm:px-6 lg:px-8"
                style={{ backgroundImage: `url(${frameBg})` }}
            >
                <div className="flex flex-col items-center justify-center w-full p-8 bg-white md:w-1/3  font-custom  rounded-md shadow-lg mx-auto my-auto">
                    <div className="w-full max-w-md">
                        <img
                            src={logo}
                            alt="Cric11"
                            className="w-25 mb-8 h-11 mx-auto"
                        />
                        <h2 className="text-3xl font-semibold text-left">
                            Hi, Welcome
                        </h2>
                        <p className="mb-6 text-sm text-left">
                            {"Welcome back You've been missed!"}
                        </p>

                        <form>
                            <div className="mb-4">
                                <label
                                    htmlFor="email"
                                    className="block text-sm text-black-600/80"
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full px-3 py-2 border border-gray-500 rounded-md outline-gray-500 bg-red-50"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {errors.email && touched.email ? (
                                    <p className="text-xs italic text-red-500">
                                        {errors.email}
                                    </p>
                                ) : null}
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="password"
                                    className="block text-sm text-black"
                                >
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    className="w-full px-3 py-2 border border-gray-500 rounded-md outline-gray-500 bg-red-50"
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {errors.password && touched.password ? (
                                    <p className="text-xs italic text-red-500">
                                        {errors.password}
                                    </p>
                                ) : null}
                            </div>

                            <button
                                type="submit"
                                className="w-1/3 block bg-[#7F0019] text-white p-2 rounded-md hover:bg-[#A70024] mx-auto"
                                onClick={handleSubmit}
                            >
                                Send OTP
                            </button>
                            {errors.submit && (
                                <div className="text-red-500 mx-auto text-center mt-3">
                                    {errors.submit}
                                </div>
                            )}
                        </form>

                        <p className="mt-4 text-center text-black">
                            Not registered yet ?{' '}
                            <span className="text-[#7F0019]">
                                <Link
                                    to="/signup"
                                    className="font-semibold underline"
                                >
                                    Create An Account
                                </Link>
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
                    <div className="w-10 h-10 border-4 border-gray-300 border-t-white rounded-full animate-spin"></div>
                </div>
            )}
        </div >
    );
};
export default SignIn;
