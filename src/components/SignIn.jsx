import React, { useEffect, useState } from 'react';
import {
    Link,
    unstable_HistoryRouter,
    useNavigate,
    useLocation,
} from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import frameBg from '../assets/frameBg.png';
import axios from 'axios';
import { API_URL } from '../../Constants';

const SignIn = () => {
    console.log('APi url: ', API_URL);
    const navigate = useNavigate();
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
            const data = {
                email: values.email,
                password: values.password,
            };
            console.log('Data: ', data);
            try {
                const res = await axios.post(`${API_URL}/users/login`, data);
                console.log('Response: ', res.data.data.accessToken);
                localStorage.setItem('accessToken', res.data.data.accessToken);
                navigate('/');
                action.resetForm();
            } catch (error) {
                console.error('Login failed:', error);
                action.setErrors({
                    submit: error.response?.data?.message || 'Login failed',
                });
            } finally {
                action.setSubmitting(false);
            }
        },
    });
    return (
        <div
            className="flex min-h-screen bg-cover bg-center"
            style={{ backgroundImage: `url(${frameBg})` }}
        >
            <div className="flex flex-col items-center justify-center w-full p-8 bg-white md:w-1/3  font-custom  rounded-md shadow-lg mx-auto my-auto ">
                <div className="w-full max-w-md">
                    <img
                        src="https://play-lh.googleusercontent.com/MS3WHL2xqhJt1YYj3KGW5loOq8Sv9WF1sXLXPt9kuRbFSn5Q1kRRA8st8N-Czh62uVT2=w600-h300-pc0xffffff-pd"
                        alt="Website Logo"
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
                            {/* {isLoading === true ? 'Loading...' : 'Login'} */}
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
    );
};
export default SignIn;
