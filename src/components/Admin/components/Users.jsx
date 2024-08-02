import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
// import dummyUsers from "../dummyUsers";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const limit = 10;

  // const fetchUsers = async (page) => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.get("url");
  //     setUsers(response.data.users);
  //     setCurrentPage(response.data.currentPage);
  //     setTotalPages(response.data.totalPages);
  //   } catch (error) {
  //     console.log("Error while fetching users: ", error);
  //   }
  //   setLoading(false);
  // };

  // const fetchUsers = (page) => {
  //   setLoading(true);
  //   // Simulate API call with dummy data
  //   setTimeout(() => {
  //     const totalUsers = dummyUsers.users.length;
  //     const startIndex = (page - 1) * limit;
  //     const endIndex = startIndex + limit;
  //     const paginateUsers = dummyUsers.users.slice(startIndex, endIndex);
  //     // const { users, currentPage, totalPages } = dummyUsers;
  //     setUsers(paginateUsers);
  //     // setCurrentPage(currentPage);
  //     setTotalPages(Math.ceil(totalUsers / limit));
  //     setLoading(false);
  //   }, 500);
  // };
  // useEffect(() => {
  //   fetchUsers(currentPage);
  // }, [currentPage]);

  // const handlePageChange = (page) => {
  //   if (page > 0 && page <= totalPages) {
  //     setCurrentPage(page);
  //   }
  // };
  return (
    // <>
    //   <h2 className="text-2xl font-bold mb-5">All Users</h2>
    //   <div className="bg-gray-800 w-full rounded-lg">
    //     {loading ? (
    //       <p>Loading...</p>
    //     ) : (
    //       <div>
    //         <table className="min-w-full bg-gray-800 rounded-lg">
    //           <thead>
    //             <tr className="text-left ">
    //               <th className="py-2 text-xl px-4 border-b">Name</th>
    //               <th className="py-2 text-xl border-b">Email</th>
    //               <th className="py-2 text-xl border-b">Added On</th>
    //             </tr>
    //           </thead>
    //           <tbody>
    //             {users.map((user) => (
    //               <tr key={user.id} className="text-lg ">
    //                 <td className="py-2 px-4">{user.name}</td>
    //                 <td className="py-2">{user.email}</td>
    //                 <td className="py-2">
    //                   {new Date(user.addedOn).toLocaleDateString()}
    //                 </td>
    //               </tr>
    //             ))}
    //           </tbody>
    //         </table>
    //         <div className="flex justify-between items-center mt-5">
    //           <button
    //             onClick={() => handlePageChange(currentPage - 1)}
    //             disabled={currentPage === 1}
    //             className="px-4 py-2 ml-10 mb-8 mt-6 bg-gray-600 rounded disabled:opacity-50 "
    //           >
    //             Previous
    //           </button>
    //           <span className="text-black">
    //             Page {currentPage} of {totalPages}
    //           </span>
    //           <button
    //             onClick={() => handlePageChange(currentPage + 1)}
    //             disabled={currentPage === totalPages}
    //             className="px-4 py-2 mr-10 mb-8 mt-6 bg-gray-600 rounded disabled:opacity-50"
    //           >
    //             Next
    //           </button>
    //         </div>
    //       </div>
    //     )}
    //   </div>
    // </>
    <></>
  );
};

export default Users;
