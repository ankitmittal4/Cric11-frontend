import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;
// import dummyUsers from "../dummyUsers";

const Users = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const limit = 10;

    useEffect(() => {
        if (!localStorage.getItem('adminAccessToken')) {
            navigate('/admin/signin');
        }
    }, []);
    // const fetchUsers = async (page) => {
    //     setLoading(true);

    // };

    const fetchUsers = async (page) => {
        setLoading(true);
        // Simulate API call with dummy data
        try {
            const data = {
                page: page,
                limit: limit,
            }
            const res = await axios.post(
                `${API_URL}/admin/all-users`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('adminAccessToken')}`,
                    },
                },
            );
            console.log("users: ", res.data.data);

            setTotalPages(res.data.data.pagination.totalPages)
            const paginateUsers = res.data.data.users;
            setUsers(paginateUsers);
            setLoading(false);
        } catch (error) {
            console.log("Error while fetching users: ", error);
        }
    };
    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    return (
        <>
            <h2 className="text-2xl font-bold mb-5">All Cric Users</h2>
            <div className="bg-gray-800 w-full rounded-lg">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div>
                        <table className="min-w-full bg-gray-800 rounded-lg">
                            <thead>
                                <tr className="text-left ">
                                    <th className="py-2 text-xl px-4 border-b">Name</th>
                                    <th className="py-2 text-xl border-b">Email</th>
                                    <th className="py-2 text-xl border-b">Username</th>
                                    <th className="py-2 text-xl border-b">Added On</th>
                                    <th className="py-2 text-xl border-b text-center">Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id} className="text-lg ">
                                        <td className="py-2 px-4">{user.fullName}</td>
                                        <td className="py-2">{user.email}</td>
                                        <td className="py-2">{user.username}</td>
                                        <td className="py-2">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-2 text-center">{user.walletBalance}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="flex justify-between items-center mt-5">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 ml-10 mb-8 mt-6 bg-gray-600 rounded disabled:opacity-50 "
                            >
                                Previous
                            </button>
                            <span className="text-black">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 mr-10 mb-8 mt-6 bg-gray-600 rounded disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Users;
