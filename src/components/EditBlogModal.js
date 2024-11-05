// EditBlogModal.js
import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { Notyf } from 'notyf';

export default function EditBlogModal({ show, handleClose, blog, onUpdate }) {
    const [title, setTitle] = useState(blog.title);
    const [content, setContent] = useState(blog.content);
    const [author, setAuthor] = useState(blog.author);
    const notyf = new Notyf();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const blogData = { title, content, author };

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://blogapp-api-huj7.onrender.com/blogs/updateBlog/${blog._id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(blogData),
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('Error response:', errorData);
                throw new Error('Failed to edit blog. Please try again.');
            }

            const data = await response.json();
            notyf.success(data.message || 'Blog edited successfully');
            onUpdate(); // Call update function to refresh the blog list
            handleClose(); // Close modal after success
        } catch (error) {
            console.error('Error editing blog:', error);
            notyf.error(error.message || 'Failed to edit blog. Please try again.');
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Blog</Modal.Title>
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
                    <Form.Group controlId="blogAuthor">
                        <Form.Label>Author</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter author name"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Edit Blog
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
