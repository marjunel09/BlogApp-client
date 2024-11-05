import React from 'react';
import { Table, Button } from 'react-bootstrap';
import './AdminView.css'; // Make sure to create this CSS file

const AdminView = ({ blogs, onEdit, onDelete, onDeleteComment }) => (
    <Table striped bordered hover className="admin-table text-center"> {/* Center align text */}
        <thead>
            <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Creation Date</th>
                <th>Comments</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {blogs.map((blog) => (
                <tr key={blog._id}>
                    <td>{blog.title}</td>
                    <td>{blog.author}</td>
                    <td>{new Date(blog.creationDate).toLocaleDateString()}</td>
                    <td>
                        {blog.comments.length > 0 ? (
                            blog.comments.map(comment => (
                                <div key={comment._id} className="comment-container d-flex justify-content-center align-items-center"> {/* Center align comments */}
                                    <span className="comment-text">{comment.text} - <strong>{comment.user}</strong></span>
                                    <Button variant="danger" onClick={() => onDeleteComment(blog._id, comment._id)} className="delete-comment-btn">Delete</Button>
                                </div>
                            ))
                        ) : (
                            <span>No comments</span>
                        )}
                    </td>
                    <td>
                        <Button variant="danger" onClick={() => onDelete(blog._id)} className="delete-blog-btn">Delete Blog</Button>
                    </td>
                </tr>
            ))}
        </tbody>
    </Table>
);

export default AdminView;
