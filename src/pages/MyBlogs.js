import React, { useEffect, useState, useContext } from 'react';
import { Button } from 'react-bootstrap';
import EditBlogModal from '../components/EditBlogModal';
import UserContext from "../context/UserContext";
import { Notyf } from 'notyf';
import { useNavigate } from 'react-router-dom';
import UserView from '../components/UserView';

const MyBlogs = () => {
    const { user } = useContext(UserContext);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const notyf = new Notyf();
    const navigate = useNavigate();

    const fetchMyBlogs = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('https://blogapp-api-huj7.onrender.com/blogs/getMyBlogs', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch blogs. Please try again later.');
            }
            const data = await response.json();
            setBlogs(data);
        } catch (error) {
            console.error('Error fetching my blogs:', error);
            notyf.error(error.message || 'Failed to fetch blogs. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyBlogs();
    }, []);

    const handleEditBlog = (blog) => {
        setSelectedBlog(blog);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedBlog(null);
    };

    const handleUpdate = () => {
        fetchMyBlogs();
    };

    const handleDeleteBlog = async (blogId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`https://blogapp-api-huj7.onrender.com/blogs/deleteBlog/${blogId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete blog. Please try again.');
            }

            notyf.success('Blog deleted successfully');
            setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== blogId)); // Remove the deleted blog
        } catch (error) {
            console.error('Error deleting blog:', error);
            notyf.error(error.message || 'Failed to delete blog. Please try again.');
        }
    };

    if (loading) return <div className="text-center">Loading...</div>;

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">My Blogs</h2>
            <UserView
                blogs={blogs}
                onEdit={handleEditBlog}
                onDelete={handleDeleteBlog}
                showEditDelete={true}
            />
            {selectedBlog && (
                <EditBlogModal
                    show={showEditModal}
                    handleClose={handleCloseEditModal}
                    blog={selectedBlog}
                    onUpdate={handleUpdate}
                />
            )}
        </div>
    );
};

export default MyBlogs;
