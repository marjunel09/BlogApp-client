import { useEffect, useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from "notyf";

export default function Login() {
    const { user, setUser } = useContext(UserContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [buttonEnabled, setButtonEnabled] = useState(false);
    const notyf = new Notyf();

    useEffect(() => {
        setButtonEnabled(email && password);
    }, [email, password]);

    function retrieveUserDetails(accessToken) {
        fetch(`https://blogapp-api-huj7.onrender.com/users/details`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        })
        .then(res => res.json())
        .then(data => {
            console.log('Fetched user data:', data);
            // Adjusted to check data structure
            if (data._id) {
                setUser({
                    id: data._id,
                    isAdmin: data.isAdmin
                });
            } else {
                console.error('User data not found in response:', data);
            }
        })
        .catch(err => {
            console.error("Failed to fetch user details:", err);
        });
    }
    
    function authenticate(e) {
        e.preventDefault();
        fetch(`https://blogapp-api-huj7.onrender.com/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })
        .then(res => res.json())
        .then(data => {
            console.log("Login response data:", data);
            if (data.access) {
                localStorage.setItem("token", data.access);
                retrieveUserDetails(data.access); // Fetch user details using the access token
                notyf.success("Thank you for logging in.");
                setEmail("");
                setPassword("");
            } else {
                // If login failed (e.g., wrong email/password), show error message
                notyf.error("Invalid email or password. Please try again.");
            }
        })
        .catch(err => {
            console.error("Error during login:", err);
            notyf.error("Something went wrong.");
        });
    }
    
    return (
        user.id ? (
            <Navigate to="/blogs" />
        ) : (
            <Form onSubmit={authenticate}>
                <h1 className="my-5 text-center">Login</h1>

                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mt-4"
                    disabled={!buttonEnabled}
                >
                    Submit
                </Button>
            </Form>
        )
    );
}
