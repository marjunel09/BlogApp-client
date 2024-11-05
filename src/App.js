// App.js
import "./App.css";
import { useState, useEffect } from "react";
import { UserProvider } from "./context/UserContext";
import { Container } from "react-bootstrap";
import AppNavBar from "./components/AppNavBar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Error from "./pages/Error";
import Blogs from "./pages/Blogs";
import BlogCardPage from "./components/BlogCardPage"; 
import MyBlogs from "./pages/MyBlogs"; // Import the MyBlogs component

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

function App() {
  const [user, setUser] = useState({
    id: null,
    isAdmin: null
  });

  function unsetUser() {
    localStorage.clear();
  }

  useEffect(() => {
    if (localStorage.getItem("token") !== null) {
      fetch(`https://blogapp-api-huj7.onrender.com/users/details`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
        .then(res => res.json())
        .then(data => {
          setUser({
            id: data._id,
            isAdmin: data.isAdmin
          });
        })
        .catch(err => console.error('Error fetching user details:', err));
    } else {
      setUser({
        id: null,
        isAdmin: null
      });
    }
  }, []);

  return (
    <UserProvider value={{ user, setUser, unsetUser }}>
      <Router>
        <AppNavBar />
        <Container>
          <Routes>
            <Route path="/" element={<Blogs />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/myBlogs" element={<MyBlogs />} /> {/* New route for My Blogs */}
            <Route path="/blogs/:id" element={<BlogCardPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </Container>
      </Router>
    </UserProvider>
  );
}

export default App;
