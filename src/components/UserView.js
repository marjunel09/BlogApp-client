// UserView.jsx
import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './UserView.css'; // Ensure you have this CSS file

const UserView = ({ blogs, onEdit, onDelete, showEditDelete }) => {
    const navigate = useNavigate();

    return (
        <Row>
            {blogs.length > 0 ? (
                blogs.map((blog) => (
                    <Col md={4} key={blog._id} className="mb-4">
                        <Card className="shadow-sm rounded blog-card">
                            <Card.Body>
                                <Card.Title className="blog-title">{blog.title}</Card.Title>
                                <Card.Text>
                                    {blog.content.substring(0, 100)}...
                                </Card.Text>
                                <div className="d-flex justify-content-between align-items-center">
                                    {showEditDelete && (
                                        <>
                                            <Button onClick={() => onEdit(blog)} className="custom-button">Edit</Button>
                                            <Button onClick={() => onDelete(blog._id)} className="custom-button">Delete</Button>
                                        </>
                                    )}
                                    <Button onClick={() => navigate(`/blogs/${blog._id}`)} className="custom-button">View Details</Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))
            ) : (
                <Col className="text-center">
                    <p>No blog posts available. Please add some blogs.</p>
                </Col>
            )}
        </Row>
    );
};

export default UserView;
