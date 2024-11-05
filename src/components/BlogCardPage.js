// BlogCardPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Form } from 'react-bootstrap';
import { Notyf } from 'notyf';

const BlogCardPage = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [commentText, setCommentText] = useState("");
    const navigate = useNavigate();
    const notyf = new Notyf();

    // Fetch the blog data
    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`https://blogapp-api-huj7.onrender.com/blogs/getBlog/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) throw new Error('Failed to fetch blog details.');

                const data = await response.json();
                setBlog(data);
            } catch (error) {
                console.error('Error fetching blog details:', error);
                notyf.error(error.message || 'Failed to load blog details.');
                navigate('/blogs');
            }
        };

        fetchBlog();
    }, [id, navigate]);

    // Handle comment submission
    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://blogapp-api-huj7.onrender.com/blogs/addComment/${id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: commentText })
            });

            if (!response.ok) throw new Error('Failed to add comment.');

            const data = await response.json();
            setBlog(data.blog); // Update blog data with the new comment
            setCommentText(""); // Clear input field
            notyf.success('Comment added successfully');
        } catch (error) {
            console.error('Error adding comment:', error);
            notyf.error(error.message || 'Failed to add comment. Please try again.');
        }
    };

    return blog ? (
        <div className="blog-card-page">
            <Card className="shadow-lg p-4">
                <Card.Body>
                    <Card.Title>{blog.title}</Card.Title>
                    <Card.Text><strong>Author:</strong> {blog.author}</Card.Text>
                    <Card.Text>{blog.content}</Card.Text>
                    <Card.Text><small>Created on: {new Date(blog.creationDate).toLocaleDateString()}</small></Card.Text>

                    {blog.comments && blog.comments.length > 0 && (
                        <div className="mt-4">
                            <h5>Comments:</h5>
                            {blog.comments.map((comment) => (
                                <Card key={comment._id} className="mb-2 p-2">
                                    <Card.Text><strong>{comment.user}</strong></Card.Text> {/* This will now show the username */}
                                    <Card.Text>{comment.text}</Card.Text>
                                    <Card.Text><small>{new Date(comment.date).toLocaleString()}</small></Card.Text>
                                </Card>
                            ))}
                        </div>
                    )}

                    <Form onSubmit={handleCommentSubmit} className="mt-4">
                        <Form.Group controlId="commentText">
                            <Form.Label>Add a Comment</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Write your comment here"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="mt-2">
                            Submit Comment
                        </Button>
                    </Form>

                    <Button onClick={() => navigate(-1)} variant="secondary" className="mt-3">Go Back</Button>
                </Card.Body>
            </Card>
        </div>
    ) : (
        <p>Loading...</p>
    );
};

export default BlogCardPage;
