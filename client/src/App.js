import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, Link } from 'react-router-dom'; // Removed useNavigate
import UserData from './UserData';
import OverData from './OverData';
import Signup from './Signup'; // Import the Signup component
import Login from './Login'; // Import the Login component

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

    return (
        <div className="App">
            <nav>
                <Link to="/">Home</Link>
                <Link to="/user-data">User Data</Link>
                <Link to="/overdata">Over Data</Link>
                <Link to="/signup">Signup</Link> {/* Add Signup link */}
                <Link to="/login">Login</Link> {/* Add Login link */}
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
                <Route path="/signup" element={<Signup />} /> {/* Route for Signup */}
                <Route path="/login" element={<Login />} /> {/* Route for Login */}
            </Routes>
        </div>
    );
}

export default App;
