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
import logo from "../assets/logo.png"
const API_URL = import.meta.env.VITE_API_URL;

const SignUp = () => {
    const navigate = useNavigate();
    const validationSchema = Yup.object({
        username: Yup.string()
            .required('Enter username')
            .matches(
                /^[^A-Z\s]+$/,
                'Username must not contains capital letters and space',
            ),
        fullName: Yup.string().required('Enter Full Name'),
        email: Yup.string()
            .email('Invalid email')
            .matches(
                /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                'Only Gmail addresses are allowed',
            )
            .required('Enter Email'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Enter Password'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Required'),
    });

    const [isSignUpSuccess, setIsSignUpSuccess] = useState(false);

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
        initialValues: {
            username: '',
            fullName: '',
            email: '',
            password: '',
        },
        validationSchema: validationSchema,

        onSubmit: async (values, action) => {
            const data = {
                username: values.username,
                fullName: values.fullName,
                email: values.email,
                password: values.password,
            };
            // console.log('Data: ', data);
            try {
                const res = await axios.post(`${API_URL}/users/register`, data);
                navigate('/signin');
                action.resetForm();
            } catch (error) {
                console.error('Login failed:', error);
                action.setErrors({
                    submit: error.response?.data?.message || 'Signup failed',
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
            <div className="flex flex-col items-center justify-center w-full p-8 bg-white lg:w-1/3  font-custom  rounded-md shadow-lg mx-auto my-auto ">
                <div className="w-full max-w-md">
                    <img
                        src={logo}
                        alt="Cric11"
                        className="w-25 mb-8 h-11 mx-auto"
                    />
                    <h2 className="text-4xl font-semibold text-left">
                        Hi, welcome
                    </h2>
                    <p className="mb-6 text-sm text-left ">
                        Please create your account
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="flex mb-4 space-x-4">
                            <div className="w-1/2">
                                <label
                                    htmlFor="username"
                                    className="block text-sm  text-black-600/80"
                                >
                                    Username
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.username}
                                    className={`w-full px-3 py-2 border outline-gray-500 rounded-md bg-red-50 ${touched.username && errors.username
                                        ? 'border-red-500'
                                        : 'border-gray-500'
                                        }`}
                                />
                                {touched.username && errors.username && (
                                    <p className="text-xs italic text-red-500">
                                        {errors.username}
                                    </p>
                                )}
                            </div>

                            <div className="w-1/2">
                                <label
                                    htmlFor="fullName"
                                    className="block text-sm  text-black-600/80"
                                >
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.fullName}
                                    className={`w-full px-3 py-2 border outline-gray-500 rounded-md bg-red-50 ${touched.fullName && errors.fullName
                                        ? 'border-red-500'
                                        : 'border-gray-500'
                                        }`}
                                />
                                {touched.fullName && errors.fullName && (
                                    <p className="text-xs italic text-red-500">
                                        {errors.fullName}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="email"
                                className="block text-sm  text-black-600/80"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email}
                                className={`w-full px-3 py-2 border outline-gray-500 rounded-md bg-red-50 ${touched.email && errors.email
                                    ? 'border-red-500'
                                    : 'border-gray-500'
                                    }`}
                            />
                            {touched.email && errors.email && (
                                <p className="text-xs italic text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="flex mb-4 space-x-4">
                            <div className="w-1/2">
                                <label
                                    htmlFor="password"
                                    className="block text-sm  text-black-600/80"
                                >
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password}
                                    className={`w-full px-3 py-2 border outline-gray-500 rounded-md bg-red-50 ${touched.password && errors.password
                                        ? 'border-red-500'
                                        : 'border-gray-500'
                                        }`}
                                />
                                {touched.password && errors.password && (
                                    <p className="text-xs italic text-red-500">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <div className="w-1/2">
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm  text-black-600/80"
                                >
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.confirmPassword}
                                    className={`w-full px-3 py-2 border outline-gray-500 rounded-md bg-red-50 ${touched.confirmPassword &&
                                        errors.confirmPassword
                                        ? 'border-red-500'
                                        : 'border-gray-500'
                                        }`}
                                />
                                {touched.confirmPassword &&
                                    errors.confirmPassword && (
                                        <p className="text-xs italic text-red-500">
                                            {errors.confirmPassword}
                                        </p>
                                    )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-1/2 block bg-[#7F0019] text-white p-2 rounded-md hover:bg-[#A70024] mx-auto"
                            onClick={handleSubmit}
                        >
                            Register
                        </button>
                        {errors.submit && (
                            <div className="text-red-500 mx-auto text-center mt-3">
                                {errors.submit}
                            </div>
                        )}
                    </form>

                    <p className="mt-4 text-center text-black">
                        Already have an account ?{' '}
                        <span className="text-[#7F0019]">
                            <Link
                                to="/signin"
                                className="font-semibold underline"
                            >
                                Sign In
                            </Link>
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};
export default SignUp;
