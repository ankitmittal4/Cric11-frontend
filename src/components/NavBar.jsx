import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import WalletBalance from './WalletBalance';
import logout from '../assets/logout.png';
import logo from '../assets/logo.png';
import profile from '../assets/profile.svg';
import { Menu, X } from 'lucide-react';
import PropTypes from 'prop-types';


const NavBar = () => {
    const navigate = useNavigate();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem('accessToken')) {
            navigate('/signin');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/signin');
    };

    return (
        <>
            <nav className="bg-[#ed2024]  fixed top-0 left-0 w-full border-b-2 border-gray-400 z-50">
                <div className="container mx-auto flex justify-between items-center p-4">
                    <div
                        className="text-white text-xl font-bold cursor-pointer flex items-center"
                        onClick={() => navigate('/')}
                    >
                        <img className="h-7 w-7 mr-2" src={logo} alt="cric11" />
                        Cric11
                    </div>

                    <div className="flex items-center md:hidden gap-4">
                        <div className="text-white font-medium">
                            <WalletBalance />
                        </div>
                        <button
                            className="text-white focus:outline-none"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>

                    {/* Desktop Menu */}

                    <div className="hidden md:flex items-center font-medium">
                        <NavLinks />
                        <div className="text-black font-medium ml-4">
                            <WalletBalance />
                        </div>
                        <img
                            className="h-7 w-7 ml-4 cursor-pointer"
                            onClick={() => setShowLogoutConfirm(true)}
                            src={logout}
                            alt="logout"
                        />
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden mt- flex flex-col bg-[#b81a1e] px-4 pb-4 font-medium space-y-3 ">
                        <NavLinks onClick={() => setIsMobileMenuOpen(false)} />

                        <button
                            onClick={() => {
                                setIsMobileMenuOpen(false);
                                setShowLogoutConfirm(true);
                            }}
                            className="flex items-center gap-2 text-gray-300 hover:rounded md:hover:py-0 hover:py-2 md:py-0 py-2  md:hover:bg-transparent hover:bg-gray-200 md:hover:text-white hover:text-gray-700 px-3"
                        >
                            {/* <img className="h-6 w-6" src={logout} alt="logout" /> */}
                            Logout

                        </button>
                    </div>
                )}
            </nav>

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl text-center sm:w-80 w-70">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Logout</h2>
                        <p className="text-gray-600 mb-6 text-sm sm:text-base">Are you sure you want to logout?</p>
                        <div className="flex justify-center gap-4 text-sm sm:text-base">
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded"
                            >
                                Log out
                            </button>
                            <button
                                onClick={() => setShowLogoutConfirm(false)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded"
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

const NavLinks = ({ onClick }) => (
    <>
        <NavLink
            to="/"
            onClick={onClick}
            className={({ isActive }) =>
                `text-gray-300 block md:inline px-3 md:mt-0 mt-3 hover:rounded md:hover:py-0 hover:py-2 md:py-0 py-2  md:hover:bg-transparent hover:bg-gray-200 md:hover:text-white hover:text-gray-700 ${isActive ? 'text-white' : ''}`
            }
        >
            Home
        </NavLink>
        <NavLink
            to="/my-contests"
            onClick={onClick}
            className={({ isActive }) =>
                `text-gray-300 block md:inline px-3 hover:rounded md:hover:py-0 hover:py-2 md:py-0 py-2  md:hover:bg-transparent hover:bg-gray-200 md:hover:text-white hover:text-gray-700 ${isActive ? 'text-white' : ''}`
            }
        >
            My Contests
        </NavLink>
        <NavLink
            to="/transactions"
            onClick={onClick}
            className={({ isActive }) =>
                `text-gray-300 block md:inline px-3 hover:rounded md:hover:py-0 hover:py-2 md:py-0 py-2  md:hover:bg-transparent hover:bg-gray-200 md:hover:text-white hover:text-gray-700 ${isActive ? 'text-white' : ''}`
            }
        >
            Transactions
        </NavLink>
    </>
);
NavLinks.propTypes = {
    onClick: PropTypes.func,
};


export default NavBar;
