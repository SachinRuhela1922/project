require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Make sure to keep this secret

const client = new MongoClient(uri);

// User Schema
const userSchema = {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
};

// Connect to MongoDB
client.connect()
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB', err));

// Endpoint to create a database
app.post('/create-database', async (req, res) => {
    const { dbName } = req.body;

    if (!dbName) {
        return res.status(400).json({ message: 'Database name is required' });
    }

    try {
        const db = client.db(dbName);
        await db.createCollection('exampleCollection'); // Create a collection in the new DB
        res.json({ message: `Database '${dbName}' created successfully!` });
    } catch (error) {
        console.error('Error creating database:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Endpoint to store data
app.post('/store-data', async (req, res) => {
    const { dbName, data } = req.body;

    if (!dbName || !data) {
        return res.status(400).json({ message: 'Database name and data are required' });
    }

    try {
        const db = client.db(dbName);
        const collection = db.collection('exampleCollection');
        await collection.insertOne(data);

        const overdataDb = client.db('overdata');
        const overdataCollection = overdataDb.collection('overdataCollection');
        await overdataCollection.insertOne(data);

        res.json({ message: 'Data stored successfully in both databases!' });
    } catch (error) {
        console.error('Error storing data:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// Endpoint to retrieve user data
app.get('/get-user-data/:dbName', async (req, res) => {
    const { dbName } = req.params;

    try {
        const db = client.db(dbName);
        const collection = db.collection('exampleCollection');
        const userData = await collection.find({}).toArray();

        res.json(userData);
    } catch (error) {
        console.error('Error retrieving user data:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// Endpoint to retrieve overdata
app.get('/get-overdata', async (req, res) => {
    try {
        const overdataDb = client.db('overdata');
        const overdataCollection = overdataDb.collection('overdataCollection');
        const overdata = await overdataCollection.find({}).toArray();

        res.json(overdata);
    } catch (error) {
        console.error('Error retrieving overdata:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// Signup Route
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const usersDb = client.db('users'); // Make sure you have a users database
        const usersCollection = usersDb.collection('users');
        const newUser = { username, password: hashedPassword };

        await usersCollection.insertOne(newUser);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Login Route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const usersDb = client.db('users'); // Make sure you have a users database
        const usersCollection = usersDb.collection('users');
        const user = await usersCollection.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
