import { useEffect, useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from "notyf";

export default function Register() {
    const { user, setUser } = useContext(UserContext);

    const [username, setUsername] = useState(""); // Added username state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isActive, setIsActive] = useState(false);

    const notyf = new Notyf();

    useEffect(() => {
        // Check if all fields are filled
        if (username !== "" && email !== "" && password !== "") {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [username, email, password]);

    function registerUser(e) {
        e.preventDefault();
        fetch(`https://blogapp-api-huj7.onrender.com/users/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username, // Include username in the request body
                email,
                password,
            })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                if (data.message === "User registered successfully") {
                    // Clear the form fields after successful registration
                    setUsername('');
                    setEmail('');
                    setPassword('');
                    notyf.success('Registration Successful');
                    console.log('User registered successfully:', data);
                } else {
                    notyf.error(data.message || 'Something went wrong');
                }
            })
            .catch(error => {
                console.error('Error during fetch:', error);
                notyf.error('An error occurred during registration. Please try again.');
            });
    }

    // Redirect if user is already logged in
    if (user.id !== null) {
        return <Navigate to="/blogs" />;
    }

    return (
        <Form onSubmit={registerUser}>
            <h1 className='my-5 text-center'>Register</h1>

            <Form.Group>
                <Form.Label>Username:</Form.Label>
                <Form.Control
                    type='text'
                    placeholder='Enter Username'
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Email:</Form.Label>
                <Form.Control
                    type='email'
                    placeholder='Enter Email'
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Password:</Form.Label>
                <Form.Control
                    type='password'
                    placeholder='Enter Password'
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </Form.Group>
            <Button 
                type="submit"
                id="submitBtn"
                className="custom-button mt-4"
                disabled={!isActive} 
            >
                {isActive ? "Submit" : "Please fill in all fields"} 
            </Button>
        </Form>
    );
}
