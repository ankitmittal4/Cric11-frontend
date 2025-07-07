import React, { useEffect, useState } from 'react';
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
const API_URL = import.meta.env.VITE_API_URL;

const SignIn = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (localStorage.getItem('accessToken')) {
            navigate('/');
        }
    }, []);
    const loginSchema = Yup.object({
        email: Yup.string()
            .email('Invalid email')
            .matches(
                /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                'Only Gmail addresses are allowed',
            )
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
                const res = await axios.post(`${API_URL}/users/login`, data);
                // console.log('Response: ', res.data.data);
                localStorage.setItem('accessToken', res.data.data.accessToken);
                localStorage.setItem('email', res.data.data.user.email);
                localStorage.setItem('fullName', res.data.data.user.fullName);
                navigate('/');

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
                action.resetForm();
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

    return (
        <div className="relative">

            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="w-10 h-10 border-4 border-gray-300 border-t-white rounded-full animate-spin"></div>
                </div>
            )}
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
                                Login
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
        </div>
    );
};
export default SignIn;
