import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserData({ dbName }) {
  const [userData, setUserData] = useState([]);
  const [dataInputs, setDataInputs] = useState(['']); // Array to hold multiple input values
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

  const handleInputChange = (index, value) => {
    const newInputs = [...dataInputs];
    newInputs[index] = value; // Update the specific input value
    setDataInputs(newInputs);
  };

  const handleAddInput = () => {
    setDataInputs([...dataInputs, '']); // Add a new empty input field
  };

  const handleStoreData = async () => {
    const validInputs = dataInputs.filter(input => input.trim() !== '');

    if (validInputs.length === 0) {
        alert('Please enter data to store.');
        return;
    }

    try {
        const response = await axios.post('http://localhost:5000/store-data', { dbName, data: validInputs.map(value => ({ value })) });
        setMessage(response.data.message);
        setDataInputs(['']); // Reset inputs after successful storage

        // Fetch updated user data
        await fetchUserData();
    } catch (error) {
        console.error('Error storing data:', error.response ? error.response.data : error.message);
        setMessage('Failed to store data: ' + (error.response ? error.response.data.message : error.message));
    }
};

  // Fetch user data function to update the state
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/get-user-data/${dbName}`);
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div>
      <h2>User Data</h2>
      {message && <p>{message}</p>}

      {/* Input fields for storing data */}
      <div>
        {dataInputs.map((input, index) => (
          <input
            key={index}
            type="text"
            value={input}
            onChange={(e) => handleInputChange(index, e.target.value)}
            placeholder={`Enter data to store ${index + 1}`}
          />
        ))}
        <button onClick={handleAddInput}>Add Another Input</button>
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
