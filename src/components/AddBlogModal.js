// AddBlogModal.js
import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { Notyf } from 'notyf';

export default function AddBlogModal({ show, handleClose }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const notyf = new Notyf();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Blog data being added, author is not included anymore
        const blogData = { title, content };
        console.log('Adding blog data:', blogData);

        try {
            const token = localStorage.getItem('token'); // Get the token

            const response = await fetch('https://blogapp-api-huj7.onrender.com/blogs/addBlog', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, // Include the token
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(blogData),
            });

            if (!response.ok) {
                const errorData = await response.text(); // Get raw response text for better debugging
                console.error('Error response:', errorData);
                throw new Error('Failed to add blog. Please try again.');
            }

            const data = await response.json();
            console.log('Blog added successfully:', data); // Log the response data
            notyf.success(data.message || 'Blog added successfully');
            handleClose(); // Close modal after success
            setTitle('');
            setContent('');
        } catch (error) {
            console.error('Error adding blog:', error);
            notyf.error(error.message || 'Failed to add blog. Please try again.');
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Blog</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="blogTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter blog title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="blogContent">
                        <Form.Label>Content</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            placeholder="Enter blog content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </Form.Group>
                    {/* Removed the author field */}
                    <Button variant="primary" type="submit">
                        Add Blog
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
