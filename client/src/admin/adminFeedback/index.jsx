import React, { useState, useEffect } from 'react';
import Sidebar from '../adminLayout/SideBar';
import Navbar from '../adminLayout/NavBar';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import ClientAPI from "../../api/clientAPI";
import "./adminFeedback.css";

export const AdminFeedback = () => {
    const [feedbacks, setFeedback] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const feedbackPerPage = 10;
    const indexOfLastFeedback = currentPage * feedbackPerPage;
    const indexOfFirstFeedback = indexOfLastFeedback - feedbackPerPage;
    const current = clients.slice(indexOfFirstClient, indexOfLastClient);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();
    useEffect(() => {
        if (Cookies.get("isAdmin") !== '1')
            navigate("/");
    }, []);

    async function fetchClients() {
        try {
            const data = { limit: clientPerPage, page: currentPage };
            const response = await ClientAPI.post("getClient", data);
            setClients(response.data);
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    }

    useEffect(() => {
        fetchClients();
    }, [currentPage]);

    const paginate = pageNumber => {
        if (pageNumber < 1 || pageNumber > Math.ceil(clients.length / clientPerPage)) {
            return;
        }
        setCurrentPage(pageNumber);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };


    const removeClients = async (event, userID) => {
        event.preventDefault();
        try {
            const data = {
                userID: userID,
            }
            await ClientAPI.post("deleteClient", data);
            alert("Deleted User Successfully");
            await fetchClients();
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Error deleting user: " + error.message);
        }
    }


    useEffect(() => {
        const modalForm = document.getElementById("addModal");

        if (modalForm) {
            if (isModalOpen) {
                modalForm.style.display = "block";
            } else {
                modalForm.style.display = "none";
            }
        }
    }, [isModalOpen]);

    return (
        <section id="content" className='adminPage terms'>
            <Sidebar />
            <Navbar />
            <main className="content-main-product">
                <div className="head-title">
                    <div className="adminLeft">
                        <h1>Feedback</h1>
                        <ul class="breadcrumb">
                            <li>
                                <a href="#">Feedback</a>
                            </li>
                            <li><i class='bx bx-chevron-right' ></i></li>
                            <li>
                                <a class="active" href="#">Home</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <table id="items-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone Number</th>
                            <th>Department</th>
                            <th>Major</th>
                            <th>Minor</th>
                            <th>School Year</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentClient.map((user) => (
                            (!user.isAdmin) && (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.fullName}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td>{user.department}</td>
                                <td>{user.major}</td>
                                <td>{user.minor}</td>
                                <td>{user.school}</td>
                                <td className="grid-container"> {/* Changed 'class' to 'className' */}
                                    <a className="edit" role="button" href={`adminUpdateUser/${user.id}`}>
                                        Edit
                                    </a>
                                    <form method="post" action="">
                                        <button className="delete" onClick={(e) => removeClients(e, user.id)}>
                                            Delete
                                        </button>
                                    </form>
                                </td>
                            </tr>)
                        ))}

                    </tbody>
                </table>
                <br /><br />
                <div className='page-number-admin'>
                    <div aria-label="Page navigation example">
                        <ul className="pagination">
                            <li className={`page-item ${currentPage <= 1 ? 'disabled' : ''}`}>
                                <a className="page-link" href={`#${currentPage - 1}`} onClick={() => paginate(currentPage - 1)} aria-label="Previous">
                                    <span aria-hidden="true">«</span>
                                </a>
                            </li>
                            {[...Array(Math.ceil(clients.length / clientPerPage)).keys()].map((number, index) => (
                                <li key={index} className="page-item">
                                    <a onClick={() => paginate(number + 1)} href={`#${number + 1}`} className={`page-link ${currentPage === number + 1 ? 'active' : ''}`}>
                                        {number + 1}
                                    </a>
                                </li>
                            ))}
                            <li className={`page-item ${currentPage >= Math.ceil(clients.length / clientPerPage) ? 'disabled' : ''}`}>
                                <a className="page-link" href={`#${currentPage + 1}`} onClick={() => paginate(currentPage + 1)} aria-label="Next">
                                    <span aria-hidden="true">»</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </main>
        </section>
    );
};
