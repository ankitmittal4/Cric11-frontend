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

const SignUp = () => {
    const loginSchema = Yup.object({
        email: Yup.string()
            // .email("Invalid email")
            // .matches(
            //   /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
            //   "Only Gmail addresses are allowed"
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

        onSubmit: (values, action) => {
            // setHomepage(true);
            // dispatch(login(values));
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
                        src="https://play-lh.googleusercontent.com/MS3WHL2xqhJt1YYj3KGW5loOq8Sv9WF1sXLXPt9kuRbFSn5Q1kRRA8st8N-Czh62uVT2=w600-h300-pc0xffffff-pd"
                        alt="Website Logo"
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
                                    htmlFor="firstName"
                                    className="block text-sm  text-black-600/80"
                                >
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.firstName}
                                    className={`w-full px-3 py-2 border outline-gray-500 rounded-md bg-red-50 ${
                                        touched.firstName && errors.firstName
                                            ? 'border-red-500'
                                            : 'border-gray-500'
                                    }`}
                                />
                                {touched.firstName && errors.firstName && (
                                    <p className="text-xs italic text-red-500">
                                        {errors.firstName}
                                    </p>
                                )}
                            </div>

                            <div className="w-1/2">
                                <label
                                    htmlFor="lastName"
                                    className="block text-sm  text-black-600/80"
                                >
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.lastName}
                                    className={`w-full px-3 py-2 border outline-gray-500 rounded-md bg-red-50 ${
                                        touched.lastName && errors.lastName
                                            ? 'border-red-500'
                                            : 'border-gray-500'
                                    }`}
                                />
                                {touched.lastName && errors.lastName && (
                                    <p className="text-xs italic text-red-500">
                                        {errors.lastName}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="phoneNumber"
                                className="block text-sm  text-black-600/80"
                            >
                                Phone Number
                            </label>
                            <input
                                type="text"
                                id="phoneNumber"
                                name="phoneNumber"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.phoneNumber}
                                className={`w-full px-3 py-2 border outline-gray-500 rounded-md bg-red-50 ${
                                    touched.phoneNumber && errors.phoneNumber
                                        ? 'border-red-500'
                                        : 'border-gray-500'
                                }`}
                            />
                            {touched.phoneNumber && errors.phoneNumber && (
                                <p className="text-xs italic text-red-500">
                                    {errors.phoneNumber}
                                </p>
                            )}
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
                                className={`w-full px-3 py-2 border outline-gray-500 rounded-md bg-red-50 ${
                                    touched.email && errors.email
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
                                    className={`w-full px-3 py-2 border outline-gray-500 rounded-md bg-red-50 ${
                                        touched.password && errors.password
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
                                    className={`w-full px-3 py-2 border outline-gray-500 rounded-md bg-red-50 ${
                                        touched.confirmPassword &&
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
