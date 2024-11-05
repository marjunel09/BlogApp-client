import React, { useState, useEffect, useContext } from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import AddBlogModal from '../components/AddBlogModal';
import EditBlogModal from '../components/EditBlogModal';
import UserContext from "../context/UserContext";
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { useNavigate } from 'react-router-dom';
import AdminView from '../components/AdminView'; // Import AdminView
import UserView from '../components/UserView'; // Import UserView
import './Blog.css';

function Blogs() {
    const { user } = useContext(UserContext);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const notyf = new Notyf();
    const navigate = useNavigate();

    const fetchBlogs = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            notyf.error('You must be logged in to view blogs.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('https://blogapp-api-huj7.onrender.com/blogs/getAllBlogs', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 403) {
                notyf.error('Access denied. Please log in to continue.');
                return; // Early return on 403 error
            }

            if (!response.ok) {
                throw new Error('Failed to fetch blogs.');
            }

            const data = await response.json();
            setBlogs(data);
        } catch (error) {
            console.error('Error fetching blogs:', error);
            notyf.error(error.message || 'Failed to fetch blogs. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleAddBlog = () => setShowAddModal(true);
    const handleEditBlog = (blog) => {
        setSelectedBlog(blog);
        setShowEditModal(true);
    };
    const handleCloseAddModal = () => setShowAddModal(false);
    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedBlog(null);
    };
    const handleUpdate = () => {
        fetchBlogs();
    };

    const handleDeleteBlog = async (blogId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`https://blogapp-api-huj7.onrender.com/blogs/deleteBlogAdmin/${blogId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete blog.');
            }

            notyf.success('Blog deleted successfully');
            handleUpdate();
        } catch (error) {
            console.error('Error deleting blog:', error);
            notyf.error(error.message || 'Failed to delete blog. Please try again.');
        }
    };
    
    const handleDeleteComment = async (blogId, commentId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`https://blogapp-api-huj7.onrender.com/blogs/deleteComment/${blogId}/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                throw new Error('Failed to delete comment.');
            }
    
            notyf.success('Comment deleted successfully');
            fetchBlogs(); // Refresh the blog list
        } catch (error) {
            console.error('Error deleting comment:', error);
            notyf.error(error.message || 'Failed to delete comment. Please try again.');
        }
    };

    if (loading) return <div className="text-center">Loading...</div>;

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Blogs</h2>

            {user && user.isAdmin ? (
                <AdminView
                    blogs={blogs}
                    onDelete={handleDeleteBlog}
                    onDeleteComment={handleDeleteComment}
                />
            ) : (
                <>
                    {user.id !== null  ? (
                        <>
                            {!user.isAdmin && (
                                <Button variant="primary" onClick={handleAddBlog} className="custom-button mb-3">
                                    Add Blog Post
                                </Button>
                            )}
                            <UserView
                                blogs={blogs}
                                onEdit={handleEditBlog}
                                onDelete={handleDeleteBlog}
                            />
                        </>
                    ) : (
                        <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: 'calc(100vh - 200px)', textAlign: 'center' }}>
                            <p>Please log in to view your blog posts.</p>
                            <Button className="custom-button" onClick={() => navigate('/login')}>
                                Go to Login
                            </Button>
                        </div>
                    )}
                </>
            )}

            <AddBlogModal show={showAddModal} handleClose={handleCloseAddModal} />

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
}

export default Blogs;
