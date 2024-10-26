import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import logo from './Image/logo.jpeg'
import { Routes, Route, Link } from 'react-router-dom';
import UserData from './UserData';
import OverData from './OverData';
import Signup from './Signup';
import Login from './Login';

function Home({ dbName, setDbName, handleCreateDatabase, message }) {
    return (
        <div>
            <h1>Create a MongoDB Database</h1>
            <input
                type="text"
                value={dbName}
                onChange={(e) => setDbName(e.target.value)}
                placeholder="Enter database name"
            />
            <button onClick={handleCreateDatabase}>Create Database</button>

            {message && <p>{message}</p>}
        </div>
    );
}

function App() {
    const [dbName, setDbName] = useState('');
    const [message, setMessage] = useState('');
    const [overData, setOverData] = useState([]);
    const [click, setClick] = useState(false); // State for mobile menu

    // Load the saved database name from localStorage
    useEffect(() => {
        const savedDbName = localStorage.getItem('dbName');
        if (savedDbName) {
            setDbName(savedDbName);
        }
    }, []);

    // Save the database name in localStorage whenever it changes
    useEffect(() => {
        if (dbName) {
            localStorage.setItem('dbName', dbName);
        }
    }, [dbName]);

    const handleCreateDatabase = async () => {
        if (!dbName) {
            alert('Please enter a database name.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/create-database', { dbName });
            setMessage(response.data.message);
        } catch (error) {
            console.error('Error creating database:', error);
            setMessage('Failed to create database.');
        }
    };

    // Fetch Over Data
    const fetchOverData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/get-overdata');
            setOverData(response.data);
        } catch (error) {
            console.error('Error fetching over data:', error.response ? error.response.data : error.message);
        }
    };

    const handleClick = () => setClick(!click); // Toggle menu visibility

    return (
        <div className="App">
            <nav className="navbar">
                <div className="navbar-container">
                   
                 
                <img className='logo' src={logo}  alt="Logo" />
                    
                    <div className="navbar-toggle" onClick={handleClick}>
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </div>
                    <ul className={`nav-menu ${click ? 'active' : ''}`}>
                        <li className="nav-item">
                            <Link to="/" className="nav-links">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/user-data" className="nav-links">User Data</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/overdata" className="nav-links">Over Data</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/signup" className="nav-links">Signup</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/login" className="nav-links">Login</Link>
                        </li>
                    </ul>
                </div>
            </nav>

            <Routes>
                <Route
                    path="/"
                    element={
                        <Home
                            dbName={dbName}
                            setDbName={setDbName}
                            handleCreateDatabase={handleCreateDatabase}
                            message={message}
                        />
                    }
                />
                <Route path="/user-data" element={<UserData dbName={dbName} />} />
                <Route path="/overdata" element={<OverData fetchOverData={fetchOverData} overData={overData} />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </div>
    );
}

export default App;
