import { useContext } from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import { NavLink } from 'react-router-dom';
import UserContext from "../context/UserContext";
import './AppNavBar.css';

export default function AppNavBar() {
    const { user } = useContext(UserContext);

    return (
        <Navbar expand="lg" className="custom-navbar">
            <Container fluid>
                <Navbar.Brand as={NavLink} to="/" className="navbar-brand">BlogApp</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav>

                        
                            <Nav.Link as={NavLink} to="/blogs" className="nav-link">Blogs</Nav.Link>
                        
                    </Nav>
                    {!user.isAdmin && user.id !== null && (
                    <Nav className="me-auto">
                        <Nav.Link as={NavLink} to="/blogs/myBlogs" className="nav-link">My Blogs</Nav.Link>
                    </Nav>
                    )}
                    <Nav className="ms-auto">
                        {user.id !== null ? (
                            <Nav.Link as={NavLink} to="/logout" className="nav-link">Logout</Nav.Link>
                        ) : (
                            <>
                                <Nav.Link as={NavLink} to="/login" className="nav-link">Login</Nav.Link>
                                <Nav.Link as={NavLink} to="/register" className="nav-link">Register</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
