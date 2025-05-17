import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import WalletBalance from './WalletBalance';
import { useNavigate } from 'react-router-dom';
import logout from '../assets/logout.png';
import logo from '../assets/logo.png';
import profile from '../assets/profile.svg';

const NavBar = () => {
    const navigate = useNavigate();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const cric11 = () => {
        navigate('/');
    };
    useEffect(() => {
        if (!localStorage.getItem('accessToken')) {
            navigate('/signin');
        }
    });
    const handleLogout = () => {
        localStorage.clear();
        navigate('/signin');
    };
    return (
        <>
            <nav className="bg-[#ed2024] p-4 fixed top-0 left-0 w-full border-b-2 border-gray-400 z-50">
                <div className="container mx-auto flex justify-between items-center">
                    <div
                        className="text-white text-xl font-bold cursor-pointer flex"
                        onClick={() => cric11()}
                    >
                        <img
                            className="h-7 w-7 text-center mx-auto ml-10 cursor-pointer mr-1"
                            src={logo}
                            alt="cric11"
                        ></img>
                        Cric11
                    </div>
                    <div className="font-medium flex items-center">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `text-gray-300 hover:text-white px-3  ${isActive ? 'text-white' : ''
                                }`
                            }
                        >
                            Home
                        </NavLink>

                        <NavLink
                            to="/my-contests"
                            className={({ isActive }) =>
                                `text-gray-300 hover:text-white px-3 ${isActive ? 'text-white' : ''
                                }`
                            }
                        >
                            My Contests
                        </NavLink>

                        <NavLink
                            to="/transactions"
                            className={({ isActive }) =>
                                `text-gray-300 hover:text-white px-3 ${isActive ? 'text-white' : ''
                                }`
                            }
                        >
                            Transactions
                        </NavLink>
                        <div className="text-black font-medium">
                            <WalletBalance />
                        </div>
                        <div className="text-black font-medium">
                            <img
                                className="h-7 w-7 text-center mx-auto ml-10 cursor-pointer"
                                // onClick={handleLogout}
                                onClick={() => setShowLogoutConfirm(true)}
                                src={logout}
                                alt="logout"
                            ></img>
                        </div>
                    </div>
                </div>
            </nav>
            {showLogoutConfirm && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl text-center w-82">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Logout</h2>
                        <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-10 rounded"
                            >
                                Log out
                            </button>
                            <button
                                onClick={() => setShowLogoutConfirm(false)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-10 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default NavBar;
