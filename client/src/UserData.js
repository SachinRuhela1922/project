import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserData({ dbName }) {
  const [userData, setUserData] = useState([]);
  const [dataInput, setDataInput] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/get-user-data/${dbName}`);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error.response ? error.response.data : error.message);
      }
    };

    if (dbName) {
      fetchUserData();
    }
  }, [dbName]);

  const handleStoreData = async () => {
    if (!dataInput) {
      alert('Please enter data to store.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/store-data', { dbName, data: { value: dataInput } });
      setMessage(response.data.message);
      setDataInput(''); // Clear input field after successful storage
      // Fetch updated user data
      const fetchUserData = async () => {
        const response = await axios.get(`http://localhost:5000/get-user-data/${dbName}`);
        setUserData(response.data);
      };
      fetchUserData();
    } catch (error) {
      console.error('Error storing data:', error);
      setMessage('Failed to store data.');
    }
  };

  return (
    <div>
      <h2>User Data</h2>
      {message && <p>{message}</p>}
      
      {/* Move the stored data input here */}
      <div>
        <input
          type="text"
          value={dataInput}
          onChange={(e) => setDataInput(e.target.value)}
          placeholder="Enter data to store"
        />
        <button onClick={handleStoreData}>Store Data</button>
      </div>

      <h3>Stored User Data:</h3>
      <ul>
        {userData.map((item, index) => (
          <li key={index}>{item.value}</li>
        ))}
      </ul>
    </div>
  );
}

export default UserData;
